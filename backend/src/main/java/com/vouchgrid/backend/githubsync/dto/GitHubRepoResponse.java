package com.vouchgrid.backend.githubsync.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record GitHubRepoResponse(

        Long id,

        String name,

        @JsonProperty("full_name")
        String fullName,

        @JsonProperty("html_url")
        String htmlUrl,

        String language
) {
}