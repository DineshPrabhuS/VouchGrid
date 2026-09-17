package com.vouchgrid.backend.githubsync.service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.vouchgrid.backend.githubsync.config.GitHubOAuthProperties;
import com.vouchgrid.backend.githubsync.dto.GitHubTokenResponse;
import com.vouchgrid.backend.githubsync.dto.GitHubUserProfile;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GitHubOAuthService {

    private final GitHubOAuthProperties properties;

        private final RestClient restClient;
        private final com.vouchgrid.backend.common.security.JwtService jwtService;

        public String createAuthorizationUrl() {
                String state = jwtService.generateOAuthState();

                return String.format(
                "https://github.com/login/oauth/authorize" +
                "?client_id=%s" +
                "&redirect_uri=%s" +
                                "&scope=repo" +
                                "&state=%s",
                                encode(properties.clientId()),
                                encode(properties.redirectUri()),
                                encode(state)
        );
    }

        public void validateState(String state) {
                if (!jwtService.isOAuthStateValid(state)) {
                    throw new IllegalArgumentException("Invalid or expired GitHub OAuth state");
        }
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

        public GitHubUserProfile fetchUserProfile(String accessToken) {
                GitHubUserProfile profile = restClient.get()
                                .uri("https://api.github.com/user")
                                .header("Authorization", "Bearer " + accessToken)
                                .header("Accept", "application/vnd.github+json")
                                .retrieve()
                                .body(GitHubUserProfile.class);

                if (profile == null || profile.id() == null || profile.login() == null) {
                        throw new IllegalStateException("GitHub returned an incomplete user profile");
                }
                return profile;
        }

        private String encode(String value) {
                return URLEncoder.encode(value, StandardCharsets.UTF_8);
        }

}