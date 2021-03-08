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

