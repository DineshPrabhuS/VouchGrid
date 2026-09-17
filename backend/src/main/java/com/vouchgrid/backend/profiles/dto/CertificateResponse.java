package com.vouchgrid.backend.profiles.dto;

import lombok.Builder;
import lombok.Value;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Value
@Builder
public class CertificateResponse {
    String certificateVersion;
    UUID userId;
    String githubUsername;
    String displayName;
    Instant issuedAt;
    List<CertificateContribution> contributions;

    @Value
    @Builder
    public static class CertificateContribution {
        UUID contributionId;
        String projectName;
        String repository;
        String commitSha;
        String commitMessage;
        String status;
        String decisionHash;
        String verifier;
    }
}