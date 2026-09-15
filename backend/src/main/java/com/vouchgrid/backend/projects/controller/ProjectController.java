package com.vouchgrid.backend.projects.controller;

import com.vouchgrid.backend.common.security.UserPrincipal;
import com.vouchgrid.backend.projects.dto.CreateProjectRequest;
import com.vouchgrid.backend.projects.dto.ProjectResponse;
import com.vouchgrid.backend.projects.service.ProjectService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProjectResponse createProject(
            @Valid @RequestBody CreateProjectRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {

        return projectService.createProject(
                request,
                principal.getUser().getUserId()
        );
    }
}