package com.vouchgrid.backend.auth.service;

import com.vouchgrid.backend.auth.dto.AuthResponse;
import com.vouchgrid.backend.common.security.JwtService;
import com.vouchgrid.backend.githubsync.dto.GitHubUserProfile;
import com.vouchgrid.backend.users.entity.GithubConnection;
import com.vouchgrid.backend.users.entity.User;
import com.vouchgrid.backend.users.repository.GithubConnectionRepository;
import com.vouchgrid.backend.users.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class GithubAuthService {

    private final UserRepository userRepository;
        private final GithubConnectionRepository githubConnectionRepository;
    private final JwtService jwtService;

    public AuthResponse loginWithGithub(
            GitHubUserProfile profile,
            String accessToken
    ) {
        User user = userRepository.findByGithubUserId(profile.id())
                .orElseGet(() -> User.builder()
                        .userId(java.util.UUID.randomUUID())
                        .githubUserId(profile.id())
                        .githubUsername(profile.login())
                        .createdAt(Instant.now())
                        .updatedAt(Instant.now())
                        .build());

        user.setGithubUsername(profile.login());
        user.setEmail(profile.email());
        user.setDisplayName(profile.name() == null ? profile.login() : profile.name());
        user.setAvatarUrl(profile.avatarUrl());
        user = userRepository.save(user);
        User persistedUser = user;

        GithubConnection connection = githubConnectionRepository
                .findByUser_UserId(persistedUser.getUserId())
                .orElseGet(() -> GithubConnection.builder().user(persistedUser).build());
        connection.setGithubUserId(profile.id());
        connection.setGithubUsername(profile.login());
        connection.setAccessToken(accessToken);
        githubConnectionRepository.save(connection);

        String token =
                jwtService.generateToken(
                        profile.login()
                );

        return AuthResponse.builder()
                .userId(user.getUserId().toString())
                .token(token)
                .username(user.getGithubUsername())
                .email(user.getEmail())
                .build();
    }
}