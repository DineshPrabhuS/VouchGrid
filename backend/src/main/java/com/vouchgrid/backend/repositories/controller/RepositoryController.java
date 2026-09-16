package com.vouchgrid.backend.repositories.controller;

import com.vouchgrid.backend.common.security.SecurityUtils;
import com.vouchgrid.backend.repositories.dto.CreateRepositoryRequest;
import com.vouchgrid.backend.repositories.dto.RepositoryResponse;
import com.vouchgrid.backend.repositories.service.RepositoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/projects/{projectId}/repositories")
@RequiredArgsConstructor
public class RepositoryController {

    private final RepositoryService repositoryService;

    @PostMapping
    public RepositoryResponse linkRepository(
            @PathVariable UUID projectId,
            @Valid @RequestBody CreateRepositoryRequest request
    ) {

        return repositoryService.linkRepository(
                projectId,
                getCurrentUserId(),
                request
        );
    }

    @GetMapping
    public List<RepositoryResponse> getRepositories(
            @PathVariable UUID projectId
    ) {

        return repositoryService.getRepositories(
                projectId,
                getCurrentUserId()
        );
    }

    private UUID getCurrentUserId() {
        return SecurityUtils
                .currentUser()
                .getUser()
                .getUserId();
    }
}