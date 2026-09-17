package com.vouchgrid.backend.verification.entity;

import com.vouchgrid.backend.contributions.entity.Contribution;
import com.vouchgrid.backend.users.entity.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "verifications")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Verification {

    @Id
    @Column(name = "verification_id", nullable = false)
    private UUID verificationId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "contribution_id", nullable = false, unique = true)
    private Contribution contribution;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "verifier_user_id", nullable = false)
    private User verifierUser;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private VerificationStatus status;

    @Column(columnDefinition = "TEXT")
    private String comment;

    @Column(name = "rejection_reason", length = 100)
    private String rejectionReason;

    @Column(name = "requested_at", nullable = false)
    private Instant requestedAt;

    @Column(name = "decided_at")
    private Instant decidedAt;

    @Column(name = "decision_hash", length = 64)
    private String decisionHash;

    @PrePersist
    void prePersist() {
        if (verificationId == null) verificationId = UUID.randomUUID();
        if (requestedAt == null) requestedAt = Instant.now();
    }
}