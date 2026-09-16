CREATE TABLE github_repositories (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    github_repo_id BIGINT NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    html_url VARCHAR(500),
    language VARCHAR(100)
);