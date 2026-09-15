package com.vouchgrid.backend.projects.service;

import java.util.UUID;

import com.vouchgrid.backend.projects.dto.CreateProjectRequest;
import com.vouchgrid.backend.projects.dto.ProjectResponse;

public interface ProjectService {

    ProjectResponse createProject(
            CreateProjectRequest request,
            UUID userId
    );
}