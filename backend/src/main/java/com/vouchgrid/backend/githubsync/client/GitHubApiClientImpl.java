package com.vouchgrid.backend.githubsync.client;

import java.util.Arrays;
import java.util.List;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import com.vouchgrid.backend.githubsync.dto.GitHubCommitDto;
import com.vouchgrid.backend.githubsync.dto.GitHubRepoResponse;
import com.vouchgrid.backend.githubsync.exception.GitHubReauthRequiredException;

@Component
@Profile("!mock-github")
public class GitHubApiClientImpl implements GitHubApiClient {

    private final RestClient restClient;

    public GitHubApiClientImpl(RestClient restClient) {
        this.restClient = restClient;
    }

    @Override
    public List<GitHubRepoResponse> listRepositories(String accessToken) {
        GitHubRepoResponse[] repositories;
        try {
            repositories = restClient.get()
                    .uri("https://api.github.com/user/repos")
                    .header("Authorization", "Bearer " + accessToken)
                    .header("Accept", "application/vnd.github+json")
                    .retrieve()
                    .body(GitHubRepoResponse[].class);
        } catch (RestClientResponseException exception) {
            throw reauthIfUnauthorized(exception);
        }

        return repositories == null ? List.of() : Arrays.asList(repositories);
    }

    @Override
    public List<GitHubCommitDto> listCommits(
            String accessToken,
            String owner,
            String repository
    ) {
        GitHubCommitDto[] commits;
        try {
            commits = restClient.get()
                    .uri("https://api.github.com/repos/{owner}/{repository}/commits", owner, repository)
                    .header("Authorization", "Bearer " + accessToken)
                    .header("Accept", "application/vnd.github+json")
                    .retrieve()
                    .body(GitHubCommitDto[].class);
        } catch (RestClientResponseException exception) {
            throw reauthIfUnauthorized(exception);
        }

        if (commits == null) {
            return List.of();
        }
        return Arrays.stream(commits)
                .map(commit -> getCommitDetail(accessToken, owner, repository, commit))
                .toList();
    }

    private GitHubCommitDto getCommitDetail(
            String accessToken,
            String owner,
            String repository,
            GitHubCommitDto summary
    ) {
        try {
            GitHubCommitDto detail = restClient.get()
                    .uri("https://api.github.com/repos/{owner}/{repository}/commits/{sha}",
                            owner, repository, summary.sha())
                    .header("Authorization", "Bearer " + accessToken)
                    .header("Accept", "application/vnd.github+json")
                    .retrieve()
                    .body(GitHubCommitDto.class);
            return detail == null ? summary : detail;
        } catch (RestClientResponseException exception) {
            throw reauthIfUnauthorized(exception);
        }
    }

    private RuntimeException reauthIfUnauthorized(RestClientResponseException exception) {
        if (exception.getStatusCode().value() == 401) {
            return new GitHubReauthRequiredException();
        }
        return exception;
    }
}
