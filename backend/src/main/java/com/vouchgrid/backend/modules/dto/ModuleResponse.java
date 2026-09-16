package com.vouchgrid.backend.modules.dto;

import com.vouchgrid.backend.modules.entity.ModuleStatus;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
public class ModuleResponse {

    private UUID moduleId;

    private UUID projectId;

    private String title;

    private String description;

    private ModuleStatus status;

    private Instant createdAt;
}