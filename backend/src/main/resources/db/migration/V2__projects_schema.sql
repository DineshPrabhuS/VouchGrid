CREATE TABLE projects (
    project_id BINARY(16) PRIMARY KEY,

    name VARCHAR(255) NOT NULL,
    description TEXT,

    created_by BINARY(16) NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_project_creator
        FOREIGN KEY (created_by)
        REFERENCES users(user_id)
);

CREATE TABLE project_members (
    project_id BINARY(16) NOT NULL,
    user_id BINARY(16) NOT NULL,

    role VARCHAR(20) NOT NULL,

    joined_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (project_id, user_id),

    CONSTRAINT fk_pm_project
        FOREIGN KEY (project_id)
        REFERENCES projects(project_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_pm_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);