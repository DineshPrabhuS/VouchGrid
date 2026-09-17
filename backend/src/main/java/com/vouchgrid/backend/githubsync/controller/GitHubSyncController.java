package com.vouchgrid.backend.githubsync.controller;

import com.vouchgrid.backend.common.security.SecurityUtils;
import com.vouchgrid.backend.githubsync.dto.GitHubRepoResponse;
import com.vouchgrid.backend.githubsync.dto.RepositoryCommitResponse;
import com.vouchgrid.backend.githubsync.repository.RepositoryCommitRepository;
import com.vouchgrid.backend.projects.security.ProjectAccessGuard;
import com.vouchgrid.backend.githubsync.service.GitHubRepositorySyncService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/github")
@RequiredArgsConstructor
public class GitHubSyncController {

    private final GitHubRepositorySyncService syncService;
    private final RepositoryCommitRepository commitRepository;
    private final ProjectAccessGuard accessGuard;

    @GetMapping("/repos")
    public List<GitHubRepoResponse> listRepositories() {
        return syncService.listRepositories(currentUserId());
    }

    @PostMapping("/sync/{projectId}")
    public Map<String, Object> syncProject(@PathVariable UUID projectId) {
        int synced = syncService.syncProject(projectId, currentUserId());
        return Map.of("projectId", projectId, "syncedCommits", synced);
    }

        @GetMapping("/projects/{projectId}/commits")
        public List<RepositoryCommitResponse> projectCommits(@PathVariable UUID projectId) {
        UUID userId = currentUserId();
        accessGuard.requireActiveMember(projectId, userId);
        return commitRepository.findByIdProjectId(projectId).stream()
            .map(commit -> RepositoryCommitResponse.builder()
                .commitSha(commit.getId().getCommitSha())
                .provider(commit.getId().getProvider())
                .ownerName(commit.getId().getOwnerName())
                .repositoryName(commit.getId().getRepositoryName())
                .author(commit.getAuthor()).message(commit.getMessage())
                .commitDate(commit.getCommitDate()).changedFiles(commit.getChangedFiles())
                .diffContent(commit.getDiffContent()).additions(commit.getAdditions())
                .deletions(commit.getDeletions()).build())
            .toList();
        }

    @ExceptionHandler(com.vouchgrid.backend.githubsync.exception.GitHubReauthRequiredException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public Map<String, String> reauthRequired() {
        return Map.of("error", "REAUTH_REQUIRED");
    }

    private UUID currentUserId() {
        return SecurityUtils.currentUser().getUser().getUserId();
    }
}