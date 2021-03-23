DROP TABLE IF EXISTS chatroom;
DROP TABLE IF EXISTS friendships;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS secrets;

CREATE TABLE users (
    id            SERIAL PRIMARY KEY,
    firstname    VARCHAR NOT NULL CHECK (firstname <> ''),
    lastname     VARCHAR NOT NULL CHECK (lastname <> ''),
    email         VARCHAR NOT NULL UNIQUE CHECK (email <> ''),
    password_hash VARCHAR NOT NULL CHECK (password_hash <> ''),
    img_url        TEXT,
    bio             TEXT,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE secrets (
    id            SERIAL PRIMARY KEY,
    email         VARCHAR NOT NULL CHECK (email <> ''),
    secret_code VARCHAR NOT NULL CHECK (secret_code <> ''),
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

 CREATE TABLE friendships(
    id SERIAL PRIMARY KEY,
    sender_id INT REFERENCES users(id) NOT NULL,
    recipient_id INT REFERENCES users(id) NOT NULL,
    accepted BOOLEAN DEFAULT false 
);

 CREATE TABLE chatroom(
    id SERIAL PRIMARY KEY,
    msg_sender_id INT REFERENCES users(id) NOT NULL,
    chat_msg TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);