CREATE TABLE vouches (

    vouch_id BINARY(16) PRIMARY KEY,

    project_id BINARY(16) NOT NULL,
    author_user_id BINARY(16) NOT NULL,
    recipient_user_id BINARY(16) NOT NULL,

    skill VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,

    created_at TIMESTAMP NOT NULL,

    CONSTRAINT fk_vouch_project
        FOREIGN KEY (project_id)
        REFERENCES projects(project_id),

    CONSTRAINT fk_vouch_author
        FOREIGN KEY (author_user_id)
        REFERENCES users(user_id),

    CONSTRAINT fk_vouch_recipient
        FOREIGN KEY (recipient_user_id)
        REFERENCES users(user_id)
);