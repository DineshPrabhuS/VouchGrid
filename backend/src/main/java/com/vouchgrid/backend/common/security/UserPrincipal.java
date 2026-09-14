package com.vouchgrid.backend.common.security;

import com.vouchgrid.backend.users.entity.User;
import lombok.Getter;

@Getter
public class UserPrincipal {

    private final User user;

    public UserPrincipal(User user) {
        this.user = user;
    }

    public String getUsername() {
        return user.getGithubUsername();
    }

    public Long getGithubUserId() {
        return user.getGithubUserId();
    }
}