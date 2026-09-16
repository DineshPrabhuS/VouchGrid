package com.vouchgrid.backend.githubsync.repository;

import com.vouchgrid.backend.githubsync.entity.RepositoryCommit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface RepositoryCommitRepository
        extends JpaRepository<RepositoryCommit, UUID> {

    Optional<RepositoryCommit> findByCommitHash(String commitHash);
}