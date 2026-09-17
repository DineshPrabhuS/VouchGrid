ALTER TABLE repository_commits
    RENAME TO repository_commits_legacy;

ALTER TABLE repositories
    MODIFY COLUMN owner_name VARCHAR(191) NOT NULL,
    MODIFY COLUMN repository_name VARCHAR(191) NOT NULL;

CREATE TABLE repository_commits (
    project_id BINARY(16) NOT NULL,
    provider VARCHAR(50) NOT NULL,
    owner_name VARCHAR(191) NOT NULL,
    repository_name VARCHAR(191) NOT NULL,
    commit_sha VARCHAR(191) NOT NULL,

    author VARCHAR(255),
    message TEXT,
    commit_date TIMESTAMP NULL,

    PRIMARY KEY (
        project_id,
        provider,
        owner_name,
        repository_name,
        commit_sha
    ),

    CONSTRAINT fk_commit_repository
        FOREIGN KEY (project_id, provider, owner_name, repository_name)
        REFERENCES repositories(project_id, provider, owner_name, repository_name)
        ON DELETE CASCADE
);

ALTER TABLE repositories
    ADD COLUMN sync_fingerprint VARCHAR(64) NULL;