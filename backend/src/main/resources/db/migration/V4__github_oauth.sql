CREATE TABLE github_accounts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    user_id BINARY(16) NOT NULL UNIQUE,

    github_user_id BIGINT,

    github_username VARCHAR(255),

    access_token TEXT,

    refresh_token TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_github_account_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);