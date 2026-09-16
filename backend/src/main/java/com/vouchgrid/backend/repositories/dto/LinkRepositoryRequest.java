package com.vouchgrid.backend.repositories.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LinkRepositoryRequest {

    @NotBlank
    private String provider;

    @NotBlank
    private String ownerName;

    @NotBlank
    private String repositoryName;
}