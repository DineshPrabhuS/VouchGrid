package com.vouchgrid.backend.repositories.service;

import com.vouchgrid.backend.projects.entity.Project;
import com.vouchgrid.backend.projects.repository.ProjectRepository;
import com.vouchgrid.backend.projects.security.ProjectAccessGuard;
import com.vouchgrid.backend.repositories.dto.CreateRepositoryRequest;
import com.vouchgrid.backend.repositories.dto.RepositoryResponse;
import com.vouchgrid.backend.repositories.entity.RepositoryEntity;
import com.vouchgrid.backend.repositories.entity.RepositoryId;
import com.vouchgrid.backend.repositories.repository.RepositoryEntityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class RepositoryServiceImpl
        implements RepositoryService {

    private final RepositoryEntityRepository repositoryRepository;
    private final ProjectRepository projectRepository;
    private final ProjectAccessGuard accessGuard;

    @Override
    public RepositoryResponse linkRepository(
            UUID projectId,
            UUID currentUserId,
            CreateRepositoryRequest request
    ) {

        accessGuard.requireActiveMember(
                projectId,
                currentUserId
        );

        Project project =
                projectRepository.findById(projectId)
                        .orElseThrow(() ->
                                new RuntimeException("Project not found"));

        RepositoryEntity repository =
                RepositoryEntity.builder()
                        .id(
                                new RepositoryId(
                                        projectId,
                                        request.getProvider(),
                                        request.getOwnerName(),
                                        request.getRepositoryName()
                                )
                        )
                        .project(project)
                        .createdAt(Instant.now())
                        .build();

        repositoryRepository.save(repository);

        return map(repository);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RepositoryResponse> getRepositories(
            UUID projectId,
            UUID currentUserId
    ) {

        accessGuard.requireActiveMember(
                projectId,
                currentUserId
        );

        return repositoryRepository
                .findByProject_ProjectId(projectId)
                .stream()
                .map(this::map)
                .toList();
    }

    private RepositoryResponse map(
            RepositoryEntity repository
    ) {

        return RepositoryResponse.builder()
                .projectId(
                        repository.getProject()
                                .getProjectId()
                )
                .provider(
                        repository.getId()
                                .getProvider()
                )
                .ownerName(
                        repository.getId()
                                .getOwnerName()
                )
                .repositoryName(
                        repository.getId()
                                .getRepositoryName()
                )
                .createdAt(
                        repository.getCreatedAt()
                )
                .build();
    }
}