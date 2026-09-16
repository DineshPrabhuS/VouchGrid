CREATE TABLE repositories (
    project_id BINARY(16) NOT NULL,
    provider VARCHAR(30) NOT NULL,
    owner_name VARCHAR(100) NOT NULL,
    repository_name VARCHAR(150) NOT NULL,
    repository_url VARCHAR(500) NOT NULL,

    PRIMARY KEY (
        project_id,
        provider,
        owner_name,
        repository_name
    ),

    CONSTRAINT fk_repositories_project
        FOREIGN KEY (project_id)
        REFERENCES projects(project_id)
        ON DELETE CASCADE
);


CREATE TABLE modules (
    module_id BINARY(16) NOT NULL,
    project_id BINARY(16) NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    status VARCHAR(40) NOT NULL,
    created_at TIMESTAMP NOT NULL,

    PRIMARY KEY (module_id),

    CONSTRAINT fk_modules_project
        FOREIGN KEY (project_id)
        REFERENCES projects(project_id)
        ON DELETE CASCADE
);


CREATE TABLE module_assignments (
    module_id BINARY(16) NOT NULL,
    user_id BINARY(16) NOT NULL,
    assigned_at TIMESTAMP NOT NULL,

    PRIMARY KEY (module_id, user_id),

    CONSTRAINT fk_module_assignments_module
        FOREIGN KEY (module_id)
        REFERENCES modules(module_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_module_assignments_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);