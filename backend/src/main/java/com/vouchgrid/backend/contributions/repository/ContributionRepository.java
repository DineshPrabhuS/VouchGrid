package com.vouchgrid.backend.contributions.repository;

import com.vouchgrid.backend.contributions.entity.Contribution;
import com.vouchgrid.backend.contributions.entity.ContributionStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ContributionRepository extends JpaRepository<Contribution, UUID> {

    List<Contribution> findByUser_UserIdOrderByCreatedAtDesc(UUID userId);

    List<Contribution> findByProject_ProjectIdOrderByCreatedAtDesc(UUID projectId);

    List<Contribution> findByUser_UserIdAndStatus(UUID userId, ContributionStatus status);

    Optional<Contribution> findByPublicToken(String publicToken);
}