CREATE TABLE repositories (
    project_id BINARY(16) NOT NULL,
    provider VARCHAR(50) NOT NULL,
    owner_name VARCHAR(255) NOT NULL,
    repository_name VARCHAR(255) NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (
        project_id,
        provider,
        owner_name,
        repository_name
    ),

    CONSTRAINT fk_repository_project
        FOREIGN KEY (project_id)
        REFERENCES projects(project_id)
        ON DELETE CASCADE
);

CREATE TABLE modules (
    module_id BINARY(16) PRIMARY KEY,

    project_id BINARY(16) NOT NULL,

    title VARCHAR(255) NOT NULL,
    description TEXT,

    status VARCHAR(50) NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_module_project
        FOREIGN KEY (project_id)
        REFERENCES projects(project_id)
        ON DELETE CASCADE
);

CREATE TABLE module_assignments (
    module_id BINARY(16) NOT NULL,
    user_id BINARY(16) NOT NULL,

    assigned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (
        module_id,
        user_id
    ),

    CONSTRAINT fk_assignment_module
        FOREIGN KEY (module_id)
        REFERENCES modules(module_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_assignment_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);