package com.vouchgrid.backend.githubsync.repository;

import com.vouchgrid.backend.githubsync.entity.RepositoryCommit;
import com.vouchgrid.backend.githubsync.entity.RepositoryCommitId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface RepositoryCommitRepository
        extends JpaRepository<RepositoryCommit, RepositoryCommitId> {

    List<RepositoryCommit> findByIdProjectIdAndIdProviderAndIdOwnerNameAndIdRepositoryName(
            java.util.UUID projectId,
            String provider,
            String ownerName,
            String repositoryName
    );

        List<RepositoryCommit> findByIdProjectId(UUID projectId);
}