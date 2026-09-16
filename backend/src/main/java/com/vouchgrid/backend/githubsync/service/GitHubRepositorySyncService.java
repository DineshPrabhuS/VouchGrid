package com.vouchgrid.backend.githubsync.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.vouchgrid.backend.githubsync.dto.GitHubCommitDto;
import com.vouchgrid.backend.githubsync.dto.GitHubRepoResponse;
import com.vouchgrid.backend.githubsync.entity.GitHubRepository;
import com.vouchgrid.backend.githubsync.entity.RepositoryCommit;
import com.vouchgrid.backend.githubsync.repository.GitHubRepositoryRepository;
import com.vouchgrid.backend.githubsync.repository.RepositoryCommitRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GitHubRepositorySyncService {

    private final GitHubOAuthService gitHubOAuthService;
    private final GitHubRepositoryRepository repository;
    private final RepositoryCommitRepository commitRepository;
    private final RestClient restClient;

    public int syncRepositories(String accessToken) {

        List<GitHubRepoResponse> repos =
                gitHubOAuthService.fetchRepositories(accessToken);

        for (GitHubRepoResponse repo : repos) {

            if (repository.findByGithubRepoId(repo.id()).isPresent()) {
                continue;
            }

            repository.save(
                    GitHubRepository.builder()
                            .githubRepoId(repo.id())
                            .name(repo.name())
                            .fullName(repo.fullName())
                            .htmlUrl(repo.htmlUrl())
                            .language(repo.language())
                            .build()
            );
        }

        return repos.size();
    }

    public void syncRepository(
            String token,
            String owner,
            String repo
    ) {

        GitHubCommitDto[] commits =
                restClient.get()
                        .uri("https://api.github.com/repos/" +
                                owner + "/" + repo + "/commits")
                        .header("Authorization", "Bearer " + token)
                        .retrieve()
                        .body(GitHubCommitDto[].class);

        if (commits == null) {
            return;
        }

        for (GitHubCommitDto c : commits) {

            boolean exists =
                    commitRepository
                            .findByCommitHash(c.sha())
                            .isPresent();

            if (exists) {
                continue;
            }

            RepositoryCommit commit =
                    RepositoryCommit.builder()
                            .commitHash(c.sha())
                            .author(c.commit().author().name())
                            .message(c.commit().message())
                            .commitDate(
                                    java.time.Instant.parse(
                                            c.commit().author().date()
                                    )
                            )
                            .repositoryName(repo)
                            .build();

            commitRepository.save(commit);
        }
    }
}