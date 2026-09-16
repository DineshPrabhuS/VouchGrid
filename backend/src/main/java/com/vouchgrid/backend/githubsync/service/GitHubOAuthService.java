package com.vouchgrid.backend.githubsync.service;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.vouchgrid.backend.githubsync.config.GitHubOAuthProperties;
import com.vouchgrid.backend.githubsync.dto.GitHubRepoResponse;
import com.vouchgrid.backend.githubsync.dto.GitHubTokenResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GitHubOAuthService {

    private final GitHubOAuthProperties properties;

    private final RestClient restClient;

    public String buildAuthorizationUrl() {

        return String.format(
                "https://github.com/login/oauth/authorize" +
                "?client_id=%s" +
                "&redirect_uri=%s" +
                "&scope=repo",
                properties.clientId(),
                properties.redirectUri()
        );
    }

    public String exchangeCodeForToken(String code) {

        GitHubTokenResponse response =
                restClient.post()
                        .uri("https://github.com/login/oauth/access_token")
                        .header("Accept", "application/json")
                        .body(Map.of(
                                "client_id", properties.clientId(),
                                "client_secret", properties.clientSecret(),
                                "code", code,
                                "redirect_uri", properties.redirectUri()
                        ))
                        .retrieve()
                        .body(GitHubTokenResponse.class);

        if (response == null) {
                throw new RuntimeException("Failed to get GitHub access token");
        }

        return response.accessToken();
}

        public List<GitHubRepoResponse> fetchRepositories(String accessToken) {

                System.out.println("TOKEN = " + accessToken);

                GitHubRepoResponse[] repos =
                        restClient.get()
                                .uri("https://api.github.com/user/repos")
                                .header("Authorization", "Bearer " + accessToken)
                                .header("Accept", "application/vnd.github+json")
                                .retrieve()
                                .body(GitHubRepoResponse[].class);

                return Arrays.asList(repos);
        }

        public String fetchRepositoriesRaw(String accessToken) {

        return restClient.get()
                .uri("https://api.github.com/user/repos")
                .header("Authorization", "Bearer " + accessToken)
                .header("Accept", "application/vnd.github+json")
                .retrieve()
                .body(String.class);
        }
}