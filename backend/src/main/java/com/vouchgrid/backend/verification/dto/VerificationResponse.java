package com.vouchgrid.backend.verification.dto;

import com.vouchgrid.backend.verification.entity.VerificationStatus;
import lombok.Builder;
import lombok.Value;

import java.time.Instant;
import java.util.UUID;

@Value
@Builder
public class VerificationResponse {
    UUID verificationId;
    UUID contributionId;
    UUID verifierUserId;
    String verifierUsername;
    VerificationStatus status;
    String comment;
    String rejectionReason;
    Instant requestedAt;
    Instant decidedAt;
    String decisionHash;
}