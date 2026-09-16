package com.vouchgrid.backend.projects.dto;

import java.time.Instant;
import java.util.UUID;

import com.vouchgrid.backend.projects.entity.ProjectRole;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ProjectMemberResponse {

    private UUID userId;

    private String name;

    private String email;

    private ProjectRole role;

    private Instant joinedAt;
}