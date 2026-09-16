package com.vouchgrid.backend.modules.service;

import com.vouchgrid.backend.modules.dto.AssignModuleRequest;
import com.vouchgrid.backend.modules.dto.CreateModuleRequest;
import com.vouchgrid.backend.modules.dto.ModuleResponse;

import java.util.List;
import java.util.UUID;

public interface ModuleService {

    ModuleResponse createModule(
            UUID projectId,
            UUID currentUserId,
            CreateModuleRequest request
    );

    ModuleResponse assignModule(
            UUID moduleId,
            UUID currentUserId,
            AssignModuleRequest request
    );

    List<ModuleResponse> getModules(
            UUID projectId,
            UUID currentUserId
    );
}