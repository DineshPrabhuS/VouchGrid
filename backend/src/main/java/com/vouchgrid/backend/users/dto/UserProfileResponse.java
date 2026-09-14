package com.vouchgrid.backend.users.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserProfileResponse {

    private String githubUsername;

    private String email;

    private String displayName;

    private String avatarUrl;
}