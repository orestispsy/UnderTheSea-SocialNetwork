const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const db = require("./utils/db");
const ses = require("./ses");

const multer = require("multer");
const uidSafe = require("uid-safe");
const s3 = require("./s3");
const { s3Url } = require("./config");

const crs = require("crypto-random-string");

const { hash, compare } = require("./utils/bc");

const cookieSession = require("cookie-session");


app.use(
    cookieSession({
        secret: `Hands 0FF ! This one is #dangerous to taz.`,
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);

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
    if (
        req.body.email &&
        req.body.password
    ) {
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
    if (req.body.firstname && req.body.lastname && req.body.email && req.body.password) {
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
                    res.json({ data: null });
                }
                let code=crs({ length: 6})
                db.addSecretCode(emailRes, code)
                    .then(({ rows }) => {
                        console.log("add secret code", rows);
                        ses.sendEmail(
                            emailRes, 
                            `Your Verification Code is: ${code}`,
                            "Under The Sea - Password Reset Verification" 
                        )
                            .then(() => {
                                res.json({ step: 2 });
                            })
                            .catch((err) => console.log(err));
                    })
                    .catch((err) => console.log(err));
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
         console.log("the secret is", secret)
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
    console.log(filename)
    if (req.file) {
        db.addImage(
            req.session.userId,s3Url + filename)
            .then(({ rows }) => {
                res.json({ data: rows[0] });
            })
            .catch((err) => {
                console.log(err);
            });
    } else {
         res.json({ data: null });
    }
});

app.get("/user", (req, res) => {
       db.getUser(req.session.userId)
            .then(({ rows }) => {
                console.log("GETTING USER ROWS", rows);
                res.json({ data: rows[0] });
                
            })
            .catch((err) => console.log(err));
});

app.post("/update-bio", (req, res) => {
    console.log("REQ BODY UPDATE BIO", req.body) 
    db.addBio(req.session.userId, req.body.draft)
        .then(({ rows }) => {
            console.log(" update bio ROWS", rows);
            res.json({ data: rows[0] });
        })
        .catch((err) => console.log(err));
});

app.get("*", function (req, res) {
    // runs if the user goes to any route except /welcome
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

var server = app.listen(process.env.PORT || 3001, () =>
    console.log(`🟢 Listening Port ${server.address().port} ... ~ SocialNetwork ~`)
);
