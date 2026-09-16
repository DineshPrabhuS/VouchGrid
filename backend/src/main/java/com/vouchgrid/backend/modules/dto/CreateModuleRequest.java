package com.vouchgrid.backend.modules.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateModuleRequest {

    @NotBlank
    private String title;

    private String description;
}