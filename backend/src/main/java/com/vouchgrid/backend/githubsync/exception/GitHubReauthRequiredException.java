package com.vouchgrid.backend.githubsync.exception;

public class GitHubReauthRequiredException extends RuntimeException {

    public GitHubReauthRequiredException() {
        super("GitHub authorization has expired or was revoked");
    }
}