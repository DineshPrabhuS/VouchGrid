package com.vouchgrid.backend.githubsync.client;

import java.util.List;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import com.vouchgrid.backend.githubsync.dto.GitHubCommitDto;
import com.vouchgrid.backend.githubsync.dto.GitHubRepoResponse;

@Component
@Profile("mock-github")
public class GitHubApiClientMock implements GitHubApiClient {

    @Override
    public List<GitHubRepoResponse> listRepositories(String accessToken) {
        return List.of(new GitHubRepoResponse(
                1L,
                "vouchgrid-demo",
                "vouchgrid/demo",
                "https://github.com/vouchgrid/demo",
                "Java"
        ));
    }

    @Override
    public List<GitHubCommitDto> listCommits(
            String accessToken,
            String owner,
            String repository
    ) {
        return List.of(new GitHubCommitDto(
                "mock-commit-1",
                new GitHubCommitDto.Commit(
                        new GitHubCommitDto.Author(
                                "mock-author",
                                "2026-01-01T00:00:00Z"
                        ),
                        "Implement GitHub sync"
                ),
                new GitHubCommitDto.Stats(25, 4, 29),
                List.of(
                        new GitHubCommitDto.FileChange("src/main/java/com/vouchgrid/AuthController.java", "modified", 20, 2, "@RestController\n@GetMapping\n"),
                        new GitHubCommitDto.FileChange("pom.xml", "modified", 5, 2, "spring-boot-starter-web")
                )
        ));
    }
}