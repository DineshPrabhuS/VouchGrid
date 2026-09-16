package com.vouchgrid.backend.githubsync.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.vouchgrid.backend.githubsync.entity.GitHubRepository;

public interface GitHubRepositoryRepository
        extends JpaRepository<GitHubRepository, Long> {

    Optional<GitHubRepository> findByGithubRepoId(Long githubRepoId);
}