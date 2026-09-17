package com.vouchgrid.backend.contributions.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.UUID;

@Data
public class CreateContributionRequest {
    private UUID moduleId;
    @NotBlank private String provider;
    @NotBlank private String ownerName;
    @NotBlank private String repositoryName;
    @NotBlank private String commitSha;
    @NotBlank private String title;
    private String evidence;
}