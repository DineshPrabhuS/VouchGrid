package com.vouchgrid.backend.repositories.dto;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
public class RepositoryResponse {

    private UUID projectId;

    private String provider;

    private String ownerName;

    private String repositoryName;

    private Instant createdAt;
}