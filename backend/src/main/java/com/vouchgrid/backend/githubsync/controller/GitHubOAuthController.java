package com.vouchgrid.backend.githubsync.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClient;

import com.vouchgrid.backend.githubsync.service.GitHubOAuthService;
import com.vouchgrid.backend.githubsync.service.GitHubRepositorySyncService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/github")
@RequiredArgsConstructor
public class GitHubOAuthController {

    private final GitHubOAuthService gitHubOAuthService;

    private final RestClient restClient;

    private final GitHubRepositorySyncService syncService;

    @GetMapping("/connect")
    public ResponseEntity<String> connect() {
        return ResponseEntity.ok(
                gitHubOAuthService.buildAuthorizationUrl()
        );
    }

    @GetMapping("/callback")
    public ResponseEntity<String> callback(
            @RequestParam String code) {

        String accessToken =
                gitHubOAuthService.exchangeCodeForToken(code);

        return ResponseEntity.ok(accessToken);
    }

    @GetMapping("/repos")
    public ResponseEntity<String> repos(
            @RequestParam String token) {

        return ResponseEntity.ok(
                gitHubOAuthService.fetchRepositoriesRaw(token)
        );
    }

    @PostMapping("/repos/sync")
    public ResponseEntity<String> syncRepos(
            @RequestParam String token) {

        int count = syncService.syncRepositories(token);

        return ResponseEntity.ok(
                "Synced " + count + " repositories"
        );
    }

    @GetMapping("/me")
    public Object me(@RequestParam String token) {

        return restClient.get()
                .uri("https://api.github.com/user")
                .header("Authorization", "Bearer " + token)
                .header("Accept", "application/vnd.github+json")
                .retrieve()
                .body(String.class);
    }

    @PostMapping("/sync")
    public ResponseEntity<String> sync(
            @RequestParam String token,
            @RequestParam String owner,
            @RequestParam String repo
    ) {

        syncService
                .syncRepository(token, owner, repo);

        return ResponseEntity.ok("Sync completed");
    }
}