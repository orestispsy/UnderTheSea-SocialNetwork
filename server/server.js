const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const db = require("./utils/db");
const ses = require("./ses");
const server = require("http").Server(app);
const io = require("socket.io")(server, {
    allowRequest: (req, callback) =>
        callback(null, req.headers.referer.startsWith("http://localhost:3000")),
});

const multer = require("multer");
const uidSafe = require("uid-safe");
const s3 = require("./s3");
const { s3Url } = require("./config");

const crs = require("crypto-random-string");

const { hash, compare } = require("./utils/bc");

const cookieSession = require("cookie-session");

// app.use(
//     cookieSession({
//         secret: `Hands 0FF ! This one is #dangerous to taz.`,
//         maxAge: 1000 * 60 * 60 * 24 * 14,
//     })
// );

//socket.io cookie session intergration//
const cookieSessionMiddleware = cookieSession({
    secret: `Hands 0FF ! This one is #dangerous to taz.`,
    maxAge: 1000 * 60 * 60 * 24 * 90,
});

app.use(cookieSessionMiddleware);
io.use(function (socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});
//socket.io cookiesession intergration//

app.use(compression());

app.use(express.static(path.join(__dirname, "..", "client", "public")));

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/welcome", (req, res) => {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

app.get("/login", (req, res) => {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

app.post("/login", (req, res) => {
    console.log("login body", req.body);
    if (req.body.email && req.body.password) {
        const { email, password } = req.body;
        db.loginCheck(email)
            .then(({ rows }) => {
                console.log("here you go", rows);
                if (rows.length === 0) {
                    res.json({ data: null });
                }
                compare(req.body.password, rows[0].password_hash)
                    .then((match) => {
                        if (match) {
                            req.session.userId = rows[0].id;
                            res.json({ data: rows[0] });
                        }
                    })
                    .catch((err) => console.log(err));
            })
            .catch((err) => console.log(err));
    } else {
        res.json({ data: null });
    }
});

app.post("/welcome", (req, res) => {
    console.log("welcome body", req.body);
    if (
        req.body.firstname &&
        req.body.lastname &&
        req.body.email &&
        req.body.password
    ) {
        const { firstname, lastname, email, password } = req.body;
        hash(password)
            .then((password_hash) => {
                db.addRegistration(firstname, lastname, email, password_hash)
                    .then(({ rows }) => {
                        console.log("REGISTRATION ROWS", rows);
                        req.session.userId = rows[0].id;
                        console.log("USER ID IN COOKIE:", req.session.userId);
                        res.json({ data: rows[0] });
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            })
            .catch((err) => {
                console.log(err);
            });
    } else {
        res.json({ data: null });
    }
});

app.get("/reset", (req, res) => {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

app.post("/reset/start", (req, res) => {
    console.log("login body", req.body);
    if (req.body.emailRes) {
        const { emailRes } = req.body;
        db.loginCheck(emailRes)
            .then(({ rows }) => {
                console.log("here you go", rows);
                if (rows.length === 0) {
                    console.log("reset rows", rows);
                    res.json({ data: null });
                } else {
                    let code = crs({ length: 6 });
                    db.addSecretCode(emailRes, code)
                        .then(({ rows }) => {
                            console.log("add secret code", rows);

                            ses.sendEmail(
                                emailRes,
                                `Your Verification Code is: ${code}`,
                                "Under The Sea - Password Reset Verification"
                            )
                                .then(() => {
                                    res.json({ step: 2, error: false });
                                })
                                .catch((err) => console.log(err));
                        })
                        .catch((err) => console.log(err));
                }
            })
            .catch((err) => console.log(err));
    } else {
        res.json({ data: null });
    }
});

app.post("/reset/verify", (req, res) => {
    console.log("verification body", req.body);
    if (req.body.secret && req.body.password) {
        const { secret } = req.body;
        console.log("the secret is", secret);
        db.secretCodeCheck(secret)
            .then(({ rows }) => {
                console.log("here you go", rows);
                if (rows.length === 0) {
                    res.json({ data: null });
                }
                if (req.body.secret == rows[0].secret_code) {
                    hash(req.body.password)
                        .then((password_hash) => {
                            db.updatePassword(rows[0].email, password_hash)
                                .then(({ rows }) => {
                                    res.json({ step: 3 });
                                })
                                .catch((err) => {
                                    console.log(err);
                                });
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                }
            })
            .catch((err) => console.log(err));
    } else {
        res.json({ data: null });
    }
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    const { filename } = req.file;
    console.log(filename);
    if (req.file) {
        db.getUser(req.session.userId)
            .then(({ rows }) => {
                if (rows[0].img_url) {
                    const file2delete = rows[0].img_url.replace(
                        "https://zero-psy-sp.s3.amazonaws.com/",
                        ""
                    );
                    console.log("file2delete", file2delete);
                    s3.delete(file2delete);
                    console.log("pic delete done");
                }
                db.addImage(req.session.userId, s3Url + filename)
                    .then(({ rows }) => {
                        console.log("uuploader", rows);
                        res.json({ data: rows[0] });
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            })
            .catch((err) => console.log(err));
    } else {
        res.json({ data: null });
    }
});

app.get("/api/user", (req, res) => {
    db.getUser(req.session.userId)
        .then(({ rows }) => {
            console.log("GETTING USER ROWS", rows);
            res.json({ data: rows[0] });
        })
        .catch((err) => console.log(err));
});

app.post("/user", (req, res) => {
    console.log("POST USER BODY", req.body);
    db.getUser(req.body.id)
        .then(({ rows }) => {
            if (!rows[0]) {
                console.log("oups");
                res.json({ oups: true });
            } else {
                console.log("POST USER ROWS", rows);
                res.json({ data: rows[0], id: req.session.userId });
            }
        })
        .catch((err) => console.log(err));
});

app.get("/findPeople/:selection", (req, res) => {
    db.getMatchingUsers(req.params.selection)
        .then(({ rows }) => {
            if (!rows[0]) {
                console.log("oups");
                res.json({ oups: true });
            } else {
                console.log("POST FIND PEOPLE ROWS", rows);
                res.json({ data: rows });
            }
        })
        .catch((err) => console.log(err));
});

app.get("/users/most-recent", (req, res) => {
    console.log("MOST RECENT BODY", req.body);
    db.getLastResults()
        .then(({ rows }) => {
            if (!rows[0]) {
                console.log("oups");
            } else {
                console.log("MOST RECENT ROWS", rows);
                res.json({ data: rows });
            }
        })
        .catch((err) => console.log(err));
});

app.post("/update-bio", (req, res) => {
    console.log("REQ BODY UPDATE BIO", req.body);
    db.addBio(req.session.userId, req.body.draft)
        .then(({ rows }) => {
            console.log(" update bio ROWS", rows);
            res.json({ data: rows[0] });
        })
        .catch((err) => console.log(err));
});

app.get("/friend-status/:selection", (req, res) => {
    db.getUserRelationship(req.session.userId, req.params.selection)
        .then(({ rows }) => {
            console.log(" friend-status ROWS", rows);
            res.json({
                data: rows[0],
                loggedUser: req.session.userId,
            });
        })
        .catch((err) => console.log(err));
});

app.post("/friend-status/:selection", (req, res) => {
    console.log("BOOLEAN", req.body);
    if (req.body.boolean) {
        db.deleteUserRelationship(req.session.userId, req.params.selection)
            .then(() => {
                db.addUserRelationship(
                    req.session.userId,
                    req.params.selection,
                    req.body.boolean
                )
                    .then(({ rows }) => {
                        console.log(" friend-status ROWS", rows);
                        res.json({ data: rows[0] });
                    })
                    .catch((err) => console.log(err));
            })
            .catch((err) => console.log(err));
    } else {
        db.addUserRelationship(
            req.session.userId,
            req.params.selection,
            req.body.boolean
        )
            .then(({ rows }) => {
                console.log(" friend-status ROWS", rows);
                res.json({ data: rows[0] });
            })
            .catch((err) => console.log(err));
    }
});

app.post("/friend-status-delete", (req, res) => {
    console.log("FRIEND STATUS DELETE BODY", req.body);
    db.deleteUserRelationship(
        req.session.userId,
        req.body.otherUserId || req.body.arg
    )
        .then(({ rows }) => {
            console.log("DELETING FRIEND STATUS DONE", rows);
            res.json({ data: rows });
        })
        .catch((err) => console.log(err));
});

app.get("/get-friends", (req, res) => {
    db.getFriendsStatus(req.session.userId)
        .then(({ rows }) => {
            console.log(" friend-status ROWS", rows);
            res.json({
                data: rows,
            });
        })
        .catch((err) => console.log(err));
});

app.get("/get-pending-friends", (req, res) => {
    db.getFriendsStatus(req.session.userId)
        .then(({ rows }) => {
            console.log(" friend-status ROWS", rows);
            res.json({
                data: rows,
            });
        })
        .catch((err) => console.log(err));
});

app.get("/deleteAccount", (req, res) => {
    db.getUser(req.session.userId)
        .then(({ rows }) => {
            console.log("GETTING USER ABOUT TO DELETE INFOS", rows);
            if (rows[0].img_url) {
                const file2delete = rows[0].img_url.replace(
                    "https://zero-psy-sp.s3.amazonaws.com/",
                    ""
                );
                console.log("file2delete", file2delete);
                s3.delete(file2delete);
                console.log("pic delete done");
            }
            db.deleteUserSecrets(rows[0].email)
                .then(() => {
                    console.log("user secrets deleted")
                    db.deleteUserChatMsgs(req.session.userId)
                        .then(() => {
                            console.log("user chat messages deleted")
                            db.deleteUserRelationships(req.session.userId)
                                .then(() => {
                                    console.log("user friend relations deleted")
                                    db.deleteUser(req.session.userId)
                                        .then(() => {
                                            console.log(
                                                " USER DOESN'T EXIST ANYMORE"   
                                            );
                                                        req.session = null;
                                                        res.redirect("/");
                                        })
                                        .catch((err) => console.log(err));
                                })
                                .catch((err) => console.log(err));
                        })
                        .catch((err) => console.log(err));
                })
                .catch((err) => console.log(err));

        })
        .catch((err) => console.log(err));
});

app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/");
});

app.get("*", function (req, res) {
    // runs if the user goes to any route except /welcome
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

server.listen(process.env.PORT || 3001, () =>
    console.log(
        `🟢 Listening Port ${server.address().port} ... ~ SocialNetwork ~`
    )
);

io.on("connection", function (socket) {
    if (!socket.request.session.userId) {
        return socket.disconnect(true);
    }

    const userId = socket.request.session.userId;

    db.getChatMsgs()
        .then(({ rows }) => {
            console.log(" chat-messages ROWS", rows);
            socket.emit("chatMessages", rows);
        })
        .catch((err) => console.log(err));

    socket.on("A CHAT MSG", (msg) => {
        db.addChatMsg(userId, msg)
            .then(() => {
                db.getChatMsgs()
                    .then(({ rows }) => {
                        console.log(" chat-messages ROWS IN MSG", rows);
                        io.emit("chatMessage", rows[0]);
                    })
                    .catch((err) => console.log(err));
            })
            .catch((err) => console.log(err));
    });

    console.log("socket userId", userId);
    console.log(`socket with the id ${socket.id} is now connected`);

    socket.on("disconnect", function () {
        console.log(`socket with the id ${socket.id} is now disconnected`);
    });

    io.emit("trying to talk to everyone", {
        userId,
    });

    socket.emit("welcome", {
        message: "Welome. It is nice to see you",
    });
});
