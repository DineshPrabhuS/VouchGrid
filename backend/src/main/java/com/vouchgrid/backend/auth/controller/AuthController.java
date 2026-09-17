package com.vouchgrid.backend.auth.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import com.vouchgrid.backend.auth.dto.AuthResponse;
import com.vouchgrid.backend.auth.service.GithubAuthService;
import com.vouchgrid.backend.githubsync.service.GitHubOAuthService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final GithubAuthService githubAuthService;
    private final GitHubOAuthService gitHubOAuthService;

    @Value("${frontend.url:http://localhost:5173}")
    private String frontendUrl;

    @GetMapping("/github")
    public ResponseEntity<Void> githubLogin() {
        return ResponseEntity.status(HttpStatus.FOUND)
                .header(HttpHeaders.LOCATION, gitHubOAuthService.createAuthorizationUrl())
                .build();
    }

    @GetMapping("/github/callback")
    public ResponseEntity<?> githubCallback(
            @RequestParam String code,
            @RequestParam String state
    ) {
        gitHubOAuthService.validateState(state);
        String accessToken = gitHubOAuthService.exchangeCodeForToken(code);
        AuthResponse response = githubAuthService.loginWithGithub(
                gitHubOAuthService.fetchUserProfile(accessToken),
                accessToken
        );
        String target = frontendUrl + "/#token="
            + URLEncoder.encode(response.getToken(), StandardCharsets.UTF_8)
            + "&userId=" + URLEncoder.encode(response.getUserId(), StandardCharsets.UTF_8);
        return ResponseEntity.status(HttpStatus.FOUND)
            .header(HttpHeaders.LOCATION, target)
            .build();
    }
}