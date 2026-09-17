CREATE TABLE verifications (
    verification_id BINARY(16) PRIMARY KEY,
    contribution_id BINARY(16) NOT NULL UNIQUE,
    verifier_user_id BINARY(16) NOT NULL,
    status VARCHAR(30) NOT NULL,
    comment TEXT,
    rejection_reason VARCHAR(100),
    requested_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    decided_at TIMESTAMP NULL,
    decision_hash VARCHAR(64) NULL,

    CONSTRAINT fk_verification_contribution FOREIGN KEY (contribution_id)
        REFERENCES contributions(contribution_id) ON DELETE CASCADE,
    CONSTRAINT fk_verification_verifier FOREIGN KEY (verifier_user_id)
        REFERENCES users(user_id) ON DELETE CASCADE
);