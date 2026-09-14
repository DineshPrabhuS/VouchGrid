CREATE TABLE users (
    user_id BINARY(16) PRIMARY KEY,

    github_user_id BIGINT NOT NULL UNIQUE,
    github_username VARCHAR(100) NOT NULL UNIQUE,

    email VARCHAR(255),
    display_name VARCHAR(255),
    avatar_url VARCHAR(500),

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE github_connections (
    connection_id BINARY(16) PRIMARY KEY,

    user_id BINARY(16) NOT NULL,

    github_user_id BIGINT NOT NULL,
    github_username VARCHAR(100) NOT NULL,

    access_token TEXT,
    connected_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_github_connection_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);