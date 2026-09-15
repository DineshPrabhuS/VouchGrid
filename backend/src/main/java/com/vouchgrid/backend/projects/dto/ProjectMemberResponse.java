package com.vouchgrid.backend.projects.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ProjectMemberResponse {

    private String githubUsername;

    private String displayName;

    private String role;
}