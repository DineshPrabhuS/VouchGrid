CREATE TABLE contributions (
    contribution_id BINARY(16) PRIMARY KEY,
    user_id BINARY(16) NOT NULL,
    project_id BINARY(16) NOT NULL,
    module_id BINARY(16) NULL,
    provider VARCHAR(50) NOT NULL,
    owner_name VARCHAR(191) NOT NULL,
    repository_name VARCHAR(191) NOT NULL,
    commit_sha VARCHAR(191) NOT NULL,
    title VARCHAR(255) NOT NULL,
    evidence TEXT,
    status VARCHAR(30) NOT NULL,
    revision_of_id BINARY(16) NULL,
    public_token VARCHAR(64) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_contribution_user FOREIGN KEY (user_id)
        REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_contribution_project FOREIGN KEY (project_id)
        REFERENCES projects(project_id) ON DELETE CASCADE,
    CONSTRAINT fk_contribution_module FOREIGN KEY (module_id)
        REFERENCES modules(module_id) ON DELETE SET NULL,
    CONSTRAINT fk_contribution_revision FOREIGN KEY (revision_of_id)
        REFERENCES contributions(contribution_id) ON DELETE SET NULL,
    CONSTRAINT uq_project_commit_claim UNIQUE (
        project_id, provider, owner_name, repository_name, commit_sha
    )
);