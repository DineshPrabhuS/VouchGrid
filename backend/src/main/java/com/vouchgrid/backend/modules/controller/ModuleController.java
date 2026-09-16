package com.vouchgrid.backend.modules.controller;

import com.vouchgrid.backend.common.security.SecurityUtils;
import com.vouchgrid.backend.modules.dto.AssignModuleRequest;
import com.vouchgrid.backend.modules.dto.CreateModuleRequest;
import com.vouchgrid.backend.modules.dto.ModuleResponse;
import com.vouchgrid.backend.modules.service.ModuleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/projects/{projectId}/modules")
@RequiredArgsConstructor
public class ModuleController {

    private final ModuleService moduleService;

    @PostMapping
    public ResponseEntity<ModuleResponse> createModule(
            @PathVariable UUID projectId,
            @Valid @RequestBody CreateModuleRequest request
    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        moduleService.createModule(
                                projectId,
                                getCurrentUserId(),
                                request
                        )
                );
    }

    @GetMapping
    public List<ModuleResponse> getModules(
            @PathVariable UUID projectId
    ) {

        return moduleService.getModules(
                projectId,
                getCurrentUserId()
        );
    }

    @PostMapping("/{moduleId}/assign")
    public ModuleResponse assignModule(
            @PathVariable UUID moduleId,
            @Valid @RequestBody AssignModuleRequest request
    ) {

        return moduleService.assignModule(
                moduleId,
                getCurrentUserId(),
                request
        );
    }

    private UUID getCurrentUserId() {
        return SecurityUtils
                .currentUser()
                .getUser()
                .getUserId();
    }
}