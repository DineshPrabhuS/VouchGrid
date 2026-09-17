package com.vouchgrid.backend.githubsync.client;

import com.vouchgrid.backend.githubsync.dto.GitHubCommitDto;
import com.vouchgrid.backend.githubsync.dto.GitHubRepoResponse;

import java.util.List;

public interface GitHubApiClient {

    List<GitHubRepoResponse> listRepositories(String accessToken);

    List<GitHubCommitDto> listCommits(
            String accessToken,
            String owner,
            String repository
    );
}