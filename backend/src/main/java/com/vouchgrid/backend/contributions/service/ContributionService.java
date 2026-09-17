package com.vouchgrid.backend.contributions.service;

import com.vouchgrid.backend.contributions.dto.ContributionResponse;
import com.vouchgrid.backend.contributions.dto.CreateContributionRequest;
import com.vouchgrid.backend.contributions.entity.Contribution;
import com.vouchgrid.backend.contributions.entity.ContributionStatus;
import com.vouchgrid.backend.githubsync.entity.RepositoryCommitId;
import com.vouchgrid.backend.githubsync.repository.RepositoryCommitRepository;
import com.vouchgrid.backend.modules.entity.Module;
import com.vouchgrid.backend.modules.repository.ModuleRepository;
import com.vouchgrid.backend.projects.entity.Project;
import com.vouchgrid.backend.projects.repository.ProjectRepository;
import com.vouchgrid.backend.projects.security.ProjectAccessGuard;
import com.vouchgrid.backend.users.entity.User;
import com.vouchgrid.backend.users.repository.UserRepository;
import com.vouchgrid.backend.contributions.repository.ContributionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ContributionService {

    private final ContributionRepository contributionRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ModuleRepository moduleRepository;
    private final RepositoryCommitRepository commitRepository;
    private final ProjectAccessGuard accessGuard;

    @Transactional
    public ContributionResponse submit(UUID projectId, UUID userId, CreateContributionRequest request) {
        accessGuard.requireActiveMember(projectId, userId);
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new IllegalArgumentException("Project not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        RepositoryCommitId commitId = new RepositoryCommitId(
                projectId, request.getProvider(), request.getOwnerName(),
                request.getRepositoryName(), request.getCommitSha());
        if (!commitRepository.existsById(commitId)) {
            throw new IllegalArgumentException("Commit is not synchronized for this project");
        }

        Module module = null;
        if (request.getModuleId() != null) {
            module = moduleRepository.findById(request.getModuleId())
                    .orElseThrow(() -> new IllegalArgumentException("Module not found"));
            if (!module.getProject().getProjectId().equals(projectId)) {
                throw new IllegalArgumentException("Module does not belong to project");
            }
        }

        Contribution contribution = Contribution.builder()
                .user(user).project(project).module(module)
                .provider(request.getProvider()).ownerName(request.getOwnerName())
                .repositoryName(request.getRepositoryName()).commitSha(request.getCommitSha())
                .title(request.getTitle()).evidence(request.getEvidence())
                .status(ContributionStatus.PENDING_REVIEW).build();
        return map(contributionRepository.save(contribution));
    }

    @Transactional(readOnly = true)
    public List<ContributionResponse> listProject(UUID projectId, UUID userId) {
        accessGuard.requireActiveMember(projectId, userId);
        return contributionRepository.findByProject_ProjectIdOrderByCreatedAtDesc(projectId)
                .stream().map(this::map).toList();
    }

    @Transactional(readOnly = true)
    public List<ContributionResponse> listUser(UUID userId) {
        return contributionRepository.findByUser_UserIdOrderByCreatedAtDesc(userId)
                .stream().map(this::map).toList();
    }

    @Transactional(readOnly = true)
    public Contribution get(UUID contributionId) {
        return contributionRepository.findById(contributionId)
                .orElseThrow(() -> new IllegalArgumentException("Contribution not found"));
    }

    private ContributionResponse map(Contribution contribution) {
        return ContributionResponse.builder()
                .contributionId(contribution.getContributionId())
                .userId(contribution.getUser().getUserId())
                .projectId(contribution.getProject().getProjectId())
                .moduleId(contribution.getModule() == null ? null : contribution.getModule().getModuleId())
                .projectName(contribution.getProject().getName())
                .provider(contribution.getProvider()).ownerName(contribution.getOwnerName())
                .repositoryName(contribution.getRepositoryName()).commitSha(contribution.getCommitSha())
                .title(contribution.getTitle()).evidence(contribution.getEvidence())
                .status(contribution.getStatus()).publicToken(contribution.getPublicToken())
                .createdAt(contribution.getCreatedAt()).build();
    }
}