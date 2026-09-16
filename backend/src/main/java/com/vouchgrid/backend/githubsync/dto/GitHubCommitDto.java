package com.vouchgrid.backend.githubsync.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record GitHubCommitDto(

        String sha,

        Commit commit
) {

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Commit(

            Author author,

            String message
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Author(

            String name,

            String date
    ) {}
}