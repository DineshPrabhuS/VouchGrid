CREATE TABLE skills (
    id BINARY(16) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(100) NOT NULL
);

CREATE TABLE user_skills (
    id BINARY(16) PRIMARY KEY,
    user_id BINARY(16) NOT NULL,
    skill_id BINARY(16) NOT NULL,
    confidence_score INT NOT NULL DEFAULT 0,
    contribution_count INT NOT NULL DEFAULT 0,
    verified BOOLEAN NOT NULL DEFAULT FALSE,

    CONSTRAINT uq_user_skill UNIQUE (user_id, skill_id),
    CONSTRAINT fk_user_skill_user FOREIGN KEY (user_id)
        REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_user_skill_skill FOREIGN KEY (skill_id)
        REFERENCES skills(id) ON DELETE CASCADE
);

INSERT INTO skills (id, name, category) VALUES
(UUID_TO_BIN(UUID()), 'Java', 'Backend'),
(UUID_TO_BIN(UUID()), 'Spring Boot', 'Backend'),
(UUID_TO_BIN(UUID()), 'MySQL', 'Data'),
(UUID_TO_BIN(UUID()), 'JWT', 'Security'),
(UUID_TO_BIN(UUID()), 'React', 'Frontend'),
(UUID_TO_BIN(UUID()), 'Git', 'Tooling'),
(UUID_TO_BIN(UUID()), 'REST APIs', 'Backend'),
(UUID_TO_BIN(UUID()), 'Docker', 'DevOps');