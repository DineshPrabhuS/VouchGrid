package com.vouchgrid.backend.contributions.dto;

import com.vouchgrid.backend.contributions.entity.ContributionStatus;
import lombok.Builder;
import lombok.Value;

import java.time.Instant;
import java.util.UUID;

@Value
@Builder
public class ContributionResponse {
    UUID contributionId;
    UUID userId;
    UUID projectId;
    UUID moduleId;
    String projectName;
    String provider;
    String ownerName;
    String repositoryName;
    String commitSha;
    String title;
    String evidence;
    ContributionStatus status;
    String publicToken;
    Instant createdAt;
}