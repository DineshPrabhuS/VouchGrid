package com.vouchgrid.backend.projects.dto;

import java.time.Instant;
import java.util.UUID;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ProjectResponse {

    private UUID projectId;

    private String name;

    private String description;

    private UUID createdBy;

    private Instant createdAt;
}