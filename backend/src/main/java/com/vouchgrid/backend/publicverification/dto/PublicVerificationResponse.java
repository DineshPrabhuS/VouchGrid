package com.vouchgrid.backend.publicverification.dto;

import lombok.Builder;
import lombok.Value;

import java.time.Instant;
import java.util.UUID;

@Value
@Builder
public class PublicVerificationResponse {
    UUID contributionId;
    String contributor;
    String project;
    String repository;
    String commitSha;
    String commitMessage;
    String contributionTitle;
    String status;
    String verifier;
    String comment;
    String decisionHash;
    Instant decidedAt;
}