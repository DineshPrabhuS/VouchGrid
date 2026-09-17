ALTER TABLE repository_commits
    ADD COLUMN changed_files TEXT NULL,
    ADD COLUMN diff_content MEDIUMTEXT NULL,
    ADD COLUMN additions INT NULL,
    ADD COLUMN deletions INT NULL;