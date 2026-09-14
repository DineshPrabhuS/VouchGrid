package com.vouchgrid.backend.users.service;

import com.vouchgrid.backend.users.dto.UserProfileResponse;
import com.vouchgrid.backend.users.entity.User;

import org.springframework.stereotype.Service;

@Service
public class UserService {

    public UserProfileResponse getProfile(User user) {

        return UserProfileResponse.builder()
                .githubUsername(user.getGithubUsername())
                .email(user.getEmail())
                .displayName(user.getDisplayName())
                .avatarUrl(user.getAvatarUrl())
                .build();
    }
}