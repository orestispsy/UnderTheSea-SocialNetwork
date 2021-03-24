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

module.exports.addSecretCode = (email, secret_code) => {
    const q = `
        INSERT INTO secrets (email,
        secret_code)
        VALUES ($1, $2)
        RETURNING *
    `;
    const params = [email, secret_code];
    return db.query(q, params);
};

module.exports.secretCodeCheck = (secret_code) => {
    const q = `
        SELECT * FROM secrets
        WHERE secret_code = $1
    `;
    const params = [secret_code];
    return db.query(q, params);
};

module.exports.updatePassword = (email, password_hash) => {
    const q = `
        UPDATE users
        SET password_hash = $2
        WHERE users.email = $1
    `;
    const params = [email, password_hash];
    return db.query(q, params);
};

module.exports.addImage = (userId, url) => {
    const q = `
        UPDATE users
        SET img_url = $2
        WHERE users.id = $1
        RETURNING *
    `;
    const params = [userId, url];
    return db.query(q, params);
};

module.exports.getUser = (userId) => {
    const q = `
        SELECT * FROM users
        WHERE id = $1
    `;
    const params = [userId];
    return db.query(q, params);
};

module.exports.addBio = (userId, bio) => {
    const q = `
        UPDATE users
        SET bio = $2
        WHERE users.id = $1
        RETURNING *
    `;
    const params = [userId, bio];
    return db.query(q, params);
};

module.exports.getMatchingUsers = (val) => {
    const q = `
        SELECT * FROM users WHERE firstname ILIKE $1 OR lastname ILIKE $1
    `;
    const params = [val + "%"];
    return db.query(q, params);
};

module.exports.getLastResults = () => {
    const q = `
        SELECT * FROM users
        ORDER BY id DESC
        LIMIT 3;
    `;
    return db.query(q);
};

module.exports.addUserRelationship = (user, person, acceptStatus) => {
    const q = `
        INSERT INTO friendships (sender_id, recipient_id, accepted)
        VALUES ($1, $2, $3)
        RETURNING *
    `;
    const params = [user, person, acceptStatus];
    return db.query(q, params);
};

module.exports.getUserRelationship = (user, person) => {
    const q = `
        SELECT * FROM friendships
        WHERE (recipient_id = $1 AND sender_id = $2)
        OR (recipient_id = $2 AND sender_id = $1); 
    `;
    const params = [user, person];
    return db.query(q, params);
};

module.exports.deleteUserRelationship = (user, person) => {
    const q = `
        DELETE FROM friendships
        WHERE (recipient_id = $1 AND sender_id = $2)
        OR (recipient_id = $2 AND sender_id = $1)
        RETURNING *
    `;
    const params = [user, person];
    return db.query(q, params);
};

module.exports.getFriendsStatus = (user) => {
    const q = `
        SELECT users.id, firstname, lastname, img_url, accepted, friendships.sender_id
        FROM friendships
        JOIN users
        ON (accepted = false AND recipient_id = $1 AND sender_id = users.id)
        OR (accepted = false AND sender_id = $1 AND recipient_id = users.id)
        OR (accepted = true AND recipient_id = $1 AND sender_id = users.id)
        OR (accepted = true AND sender_id = $1 AND recipient_id = users.id); 
    `;
    const params = [user];
    return db.query(q, params);
};

module.exports.addChatMsg = (msg_sender_id, chat_msg) => {
    const q = `
        INSERT INTO chatroom (msg_sender_id, chat_msg)
        VALUES ($1, $2)
        RETURNING *
    `;
    const params = [msg_sender_id, chat_msg];
    return db.query(q, params);
};

module.exports.getChatMsgs = () => {
    const q = `
        SELECT chatroom.id, firstname, lastname, img_url, msg_sender_id, chat_msg
        FROM chatroom
        JOIN users
        ON (users.id = msg_sender_id)
        ORDER BY chatroom.created_at DESC
        LIMIT 10;
    `;
    return db.query(q);
};

module.exports.deleteUser = (userId) => {
    const q = `
        DELETE FROM users
        WHERE id = $1
    `;
    const params = [userId];
    return db.query(q, params);
};

module.exports.deleteUser = (userId) => {
    const q = `
        DELETE FROM users
        WHERE id = $1

    `;
    const params = [userId];
    return db.query(q, params);
};

module.exports.deleteUserRelationships = (userId) => {
    const q = `
        DELETE FROM friendships 
        WHERE sender_id = $1 OR recipient_id = $1

    `;
    const params = [userId];
    return db.query(q, params);
};

module.exports.deleteUserChatMsgs = (userId) => {
    const q = `
        DELETE FROM chatroom
        WHERE msg_sender_id = $1
    `;
    const params = [userId];
    return db.query(q, params);
};


module.exports.deleteUserSecrets = (email) => {
    const q = `
        DELETE FROM secrets
        WHERE email = $1

    `;

    const params = [email];
    return db.query(q, params);
};