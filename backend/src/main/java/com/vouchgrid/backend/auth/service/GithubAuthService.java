package com.vouchgrid.backend.auth.service;

import com.vouchgrid.backend.auth.dto.AuthResponse;
import com.vouchgrid.backend.common.security.JwtService;
import com.vouchgrid.backend.users.entity.User;
import com.vouchgrid.backend.users.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GithubAuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    public AuthResponse mockLogin() {

        Long githubId = 123456L;

        String githubUsername = "dinesh";

        User user =
                userRepository
                        .findByGithubUserId(githubId)
                        .orElseGet(() -> {

                            User newUser = User.builder()
                                    .userId(UUID.randomUUID())
                                    .githubUserId(githubId)
                                    .githubUsername(githubUsername)
                                    .email("dinesh@example.com")
                                    .displayName("Dinesh")
                                    .avatarUrl("")
                                    .createdAt(Instant.now())
                                    .updatedAt(Instant.now())
                                    .build();

                            return userRepository.save(newUser);
                        });

        String token =
                jwtService.generateToken(
                        user.getGithubUsername()
                );

        return AuthResponse.builder()
                .token(token)
                .username(user.getGithubUsername())
                .email(user.getEmail())
                .build();
    }
}