package com.vouchgrid.backend.verification.repository;

import com.vouchgrid.backend.verification.entity.Verification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface VerificationRepository extends JpaRepository<Verification, UUID> {

    Optional<Verification> findByContribution_ContributionId(UUID contributionId);
}