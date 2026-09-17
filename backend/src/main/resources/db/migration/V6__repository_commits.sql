CREATE TABLE repository_commits (
    id BINARY(16) PRIMARY KEY,

    commit_hash VARCHAR(255) NOT NULL UNIQUE,

    author VARCHAR(255),

    message TEXT,
    commit_date TIMESTAMP NULL,
    repository_name VARCHAR(255)
);
