const spicedPg = require("spiced-pg");

const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/social-network"
);

module.exports.addRegistration = (
    firstname,
    lastname,
    email,
    password_hash
) => {
    const q = `
        INSERT INTO users (firstname, lastname, email, password_hash)
        VALUES ($1, $2, $3, $4)
        RETURNING *
    `;
    const params = [firstname, lastname, email, password_hash];
    return db.query(q, params);
};

module.exports.loginCheck = (email) => {
    const q = `
        SELECT id, password_hash
        FROM users WHERE email = $1
    `;
    const params = [email];
    return db.query(q, params);
};

module.exports.addSecretCode = (
    email,
    secret_code
) => {
    const q = `
        INSERT INTO secrets (email,
    secret_code)
        VALUES ($1, $2)
        RETURNING *
    `;
    const params = [email, secret_code];
    return db.query(q, params);
};

module.exports.secretCodeCheck = () => {
    const q = `
        SELECT * FROM secrets
WHERE CURRENT_TIMESTAMP - created_at < INTERVAL '3 minutes';
    `;
   
    return db.query(q);
};

module.exports.updatePassword= (email, password_hash) => {
    const q = `
        UPDATE users
SET password_hash = $2
WHERE users.email = $1
    `;
    const params = [email, password_hash];
    return db.query(q, params);
};