package com.vouchgrid.backend.githubsync.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record GitHubUserProfile(
        Long id,
        String login,
        String name,
        String email,
        @JsonProperty("avatar_url") String avatarUrl
) {
}