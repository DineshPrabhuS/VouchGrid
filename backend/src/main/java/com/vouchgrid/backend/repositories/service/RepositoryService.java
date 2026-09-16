package com.vouchgrid.backend.repositories.service;

import com.vouchgrid.backend.repositories.dto.CreateRepositoryRequest;
import com.vouchgrid.backend.repositories.dto.RepositoryResponse;

import java.util.List;
import java.util.UUID;

public interface RepositoryService {

    RepositoryResponse linkRepository(
            UUID projectId,
            UUID currentUserId,
            CreateRepositoryRequest request
    );

    List<RepositoryResponse> getRepositories(
            UUID projectId,
            UUID currentUserId
    );
}