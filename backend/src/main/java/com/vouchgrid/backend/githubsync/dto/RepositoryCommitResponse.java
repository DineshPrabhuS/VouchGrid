package com.vouchgrid.backend.githubsync.dto;

import lombok.Builder;
import lombok.Value;

import java.time.Instant;

@Value
@Builder
public class RepositoryCommitResponse {
    String commitSha;
    String provider;
    String ownerName;
    String repositoryName;
    String author;
    String message;
    Instant commitDate;
    String changedFiles;
    String diffContent;
    Integer additions;
    Integer deletions;
}