package com.vouchgrid.backend.githubsync.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record GitHubCommitDto(

        String sha,

        Commit commit,

        Stats stats,

        List<FileChange> files
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

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Stats(
            Integer additions,
            Integer deletions,
            Integer total
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record FileChange(
            String filename,
            String status,
            Integer additions,
            Integer deletions,
            String patch
    ) {}
}