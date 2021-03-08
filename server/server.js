const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const db = require("./utils/db");

const { hash, compare } = require("./utils/bc");

const cookieSession = require("cookie-session");


app.use(
    cookieSession({
        secret: `Hands 0FF ! This one is #dangerous to taz.`,
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);

app.use(express.urlencoded({ extended: false }));

app.use(compression());

app.use(express.static(path.join(__dirname, "..", "client", "public")));

app.use(express.json());

app.get("/welcome", (req, res) => {

    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

app.post("/welcome", (req, res) => {
    console.log("welcome body", req.body);
    if (req.body.firstname && req.body.lastname && req.body.email && req.body.password) {
        const { firstname, lastname, email, password } = req.body;
        hash(password).then((password_hash) => {
            db.addRegistration(firstname, lastname, email, password_hash)
                .then(({ rows }) => {
                    console.log("REGISTRATION ROWS", rows);
                    req.session.userId = rows[0].id;
                    console.log("USER ID IN COOKIE:", req.session.userId);
                    res.json({ data: rows[0]});
                })
                .catch(console.log(err));
        });
    } else {
        res.json({ data: null });
    }        
});

app.get("*", function (req, res) {
    // runs if the user goes to any route except /welcome
    if (!req.session.userId) {

        res.redirect("/welcome");
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

let server = app.listen(process.env.PORT || 3001, () =>
    console.log(`🟢 Listening Port ${server.address().port} ... ~ SocialNetwork ~`)
);
