package com.vouchgrid.backend.githubsync.service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.vouchgrid.backend.githubsync.client.GitHubApiClient;
import com.vouchgrid.backend.githubsync.dto.GitHubCommitDto;
import com.vouchgrid.backend.githubsync.dto.GitHubRepoResponse;
import com.vouchgrid.backend.githubsync.entity.RepositoryCommit;
import com.vouchgrid.backend.githubsync.entity.RepositoryCommitId;
import com.vouchgrid.backend.githubsync.repository.RepositoryCommitRepository;
import com.vouchgrid.backend.projects.security.ProjectAccessGuard;
import com.vouchgrid.backend.repositories.entity.RepositoryEntity;
import com.vouchgrid.backend.repositories.entity.RepositoryId;
import com.vouchgrid.backend.repositories.repository.RepositoryEntityRepository;
import com.vouchgrid.backend.users.entity.GithubConnection;
import com.vouchgrid.backend.users.repository.GithubConnectionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GitHubRepositorySyncService {

    private final GitHubApiClient gitHubApiClient;
    private final RepositoryCommitRepository commitRepository;
    private final RepositoryEntityRepository repositoryRepository;
    private final GithubConnectionRepository githubConnectionRepository;
    private final ProjectAccessGuard accessGuard;

    public List<GitHubRepoResponse> listRepositories(UUID currentUserId) {
        return gitHubApiClient.listRepositories(
                getConnection(currentUserId).getAccessToken()
        );
    }

    public int syncProject(UUID projectId, UUID currentUserId) {
        accessGuard.requireActiveMember(projectId, currentUserId);
        GithubConnection connection = getConnection(currentUserId);

        int synced = 0;
        for (RepositoryEntity repository : repositoryRepository.findByProject_ProjectId(projectId)) {
            if ("github".equalsIgnoreCase(repository.getId().getProvider())) {
                synced += syncRepository(connection.getAccessToken(), repository);
            }
        }
        return synced;
    }

    private int syncRepository(String accessToken, RepositoryEntity repository) {
        RepositoryId repositoryId = repository.getId();
        List<GitHubCommitDto> commits = gitHubApiClient.listCommits(
                accessToken,
                repositoryId.getOwnerName(),
                repositoryId.getRepositoryName()
        );

            String fingerprint = fingerprint(commits);
            if (fingerprint.equals(repository.getSyncFingerprint())) {
                return 0;
            }

        int synced = 0;
        for (GitHubCommitDto commitDto : commits) {
            RepositoryCommitId commitId = new RepositoryCommitId(
                    repositoryId.getProjectId(),
                    repositoryId.getProvider(),
                    repositoryId.getOwnerName(),
                    repositoryId.getRepositoryName(),
                    commitDto.sha()
            );

            if (commitRepository.existsById(commitId)) {
                continue;
            }

            commitRepository.save(RepositoryCommit.builder()
                    .id(commitId)
                    .repository(repository)
                    .author(commitDto.commit().author().name())
                    .message(commitDto.commit().message())
                    .commitDate(java.time.Instant.parse(commitDto.commit().author().date()))
                        .changedFiles(commitDto.files() == null ? "" : commitDto.files().stream()
                            .map(GitHubCommitDto.FileChange::filename)
                            .collect(Collectors.joining("\n")))
                        .diffContent(commitDto.files() == null ? "" : commitDto.files().stream()
                            .map(GitHubCommitDto.FileChange::patch)
                            .filter(java.util.Objects::nonNull)
                            .collect(Collectors.joining("\n")))
                        .additions(commitDto.stats() == null ? 0 : commitDto.stats().additions())
                        .deletions(commitDto.stats() == null ? 0 : commitDto.stats().deletions())
                    .build());
            synced++;
        }
        repository.setSyncFingerprint(fingerprint);
        repositoryRepository.save(repository);
        return synced;
    }

    private String fingerprint(List<GitHubCommitDto> commits) {
        String source = commits.stream()
                .map(GitHubCommitDto::sha)
                .sorted()
                .collect(Collectors.joining("\n"));
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256")
                    .digest(source.getBytes(StandardCharsets.UTF_8));
            return java.util.HexFormat.of().formatHex(digest);
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 is unavailable", exception);
        }
    }

    private GithubConnection getConnection(UUID currentUserId) {
        return githubConnectionRepository.findByUser_UserId(currentUserId)
                .orElseThrow(() -> new IllegalStateException("GitHub account is not connected"));
    }
}