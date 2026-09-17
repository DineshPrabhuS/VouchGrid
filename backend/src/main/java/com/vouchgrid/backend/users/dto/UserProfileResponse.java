package com.vouchgrid.backend.users.dto;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class UserProfileResponse {

    private UUID userId;

    private String githubUsername;

    private String email;

    private String displayName;

    private String avatarUrl;
}