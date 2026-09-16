package com.vouchgrid.backend.githubsync.repository;

import com.vouchgrid.backend.githubsync.entity.GitHubAccount;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface GitHubAccountRepository
        extends JpaRepository<GitHubAccount, Long> {

    Optional<GitHubAccount> findByUser_UserId(UUID userId);
}