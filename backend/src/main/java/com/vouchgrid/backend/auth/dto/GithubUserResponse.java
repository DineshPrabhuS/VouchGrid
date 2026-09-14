package com.vouchgrid.backend.auth.dto;

import lombok.Data;

@Data
public class GithubUserResponse {

    private Long id;

    private String login;

    private String avatar_url;

    private String email;

    private String name;
}