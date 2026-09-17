package com.vouchgrid.backend.verification.service;

import com.vouchgrid.backend.contributions.entity.Contribution;
import com.vouchgrid.backend.contributions.entity.ContributionStatus;
import com.vouchgrid.backend.contributions.repository.ContributionRepository;
import com.vouchgrid.backend.projects.entity.ProjectMember;
import com.vouchgrid.backend.projects.repository.ProjectMemberRepository;
import com.vouchgrid.backend.projects.security.ProjectAccessGuard;
import com.vouchgrid.backend.users.entity.User;
import com.vouchgrid.backend.users.repository.UserRepository;
import com.vouchgrid.backend.verification.dto.DecisionRequest;
import com.vouchgrid.backend.verification.dto.VerificationRequest;
import com.vouchgrid.backend.verification.dto.VerificationResponse;
import com.vouchgrid.backend.verification.entity.Verification;
import com.vouchgrid.backend.verification.entity.VerificationStatus;
import com.vouchgrid.backend.verification.repository.VerificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.HexFormat;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VerificationService {

    private final VerificationRepository verificationRepository;
    private final ContributionRepository contributionRepository;
    private final UserRepository userRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final ProjectAccessGuard accessGuard;

    @Transactional
    public VerificationResponse request(UUID contributionId, UUID requesterId, VerificationRequest request) {
        Contribution contribution = contribution(contributionId);
        accessGuard.requireActiveMember(contribution.getProject().getProjectId(), requesterId);
        UUID verifierId = request.getVerifierUserId() == null
                ? contribution.getProject().getCreatedBy().getUserId()
                : request.getVerifierUserId();
        validateVerifier(contribution, verifierId);
        if (verificationRepository.findByContribution_ContributionId(contributionId).isPresent()) {
            throw new IllegalStateException("A verification already exists for this contribution");
        }
        User verifier = userRepository.findById(verifierId)
                .orElseThrow(() -> new IllegalArgumentException("Verifier not found"));
        Verification verification = Verification.builder()
                .contribution(contribution).verifierUser(verifier)
                .status(VerificationStatus.PENDING).build();
        try {
            return map(verificationRepository.save(verification));
        } catch (DataIntegrityViolationException exception) {
            throw new IllegalStateException("A verification already exists for this contribution", exception);
        }
    }

    @Transactional
    public VerificationResponse decide(UUID verificationId, UUID verifierId, boolean approve, DecisionRequest request) {
        Verification verification = verificationRepository.findById(verificationId)
                .orElseThrow(() -> new IllegalArgumentException("Verification not found"));
        if (!verification.getVerifierUser().getUserId().equals(verifierId)) {
            throw new IllegalArgumentException("Only the assigned verifier can decide");
        }
        validateVerifier(verification.getContribution(), verifierId);
        if (verification.getStatus() != VerificationStatus.PENDING) {
            throw new IllegalStateException("Verification has already been decided");
        }
        if (!approve && (request.getRejectionReason() == null || request.getRejectionReason().isBlank())) {
            throw new IllegalArgumentException("Rejection reason is required");
        }

        Instant decidedAt = Instant.now();
        VerificationStatus status = approve ? VerificationStatus.VERIFIED : VerificationStatus.REJECTED;
        verification.setStatus(status);
        verification.setComment(request.getComment());
        verification.setRejectionReason(approve ? null : request.getRejectionReason());
        verification.setDecidedAt(decidedAt);
        verification.setDecisionHash(hash(verification.getContribution().getContributionId(), verifierId,
                status, request.getComment(), decidedAt));

        Contribution contribution = verification.getContribution();
        contribution.setStatus(approve ? ContributionStatus.VERIFIED : ContributionStatus.REJECTED);
        contributionRepository.save(contribution);
        return map(verificationRepository.save(verification));
    }

    @Transactional(readOnly = true)
    public VerificationResponse get(UUID contributionId, UUID requesterId) {
        Contribution contribution = contribution(contributionId);
        accessGuard.requireActiveMember(contribution.getProject().getProjectId(), requesterId);
        return verificationRepository.findByContribution_ContributionId(contributionId)
                .map(this::map)
                .orElse(null);
    }

    private void validateVerifier(Contribution contribution, UUID verifierId) {
        if (contribution.getUser().getUserId().equals(verifierId)) {
            throw new IllegalArgumentException("A user cannot verify their own contribution");
        }
        ProjectMember member = projectMemberRepository.findById(
                        new com.vouchgrid.backend.projects.entity.ProjectMemberId(
                                contribution.getProject().getProjectId(), verifierId))
                .orElseThrow(() -> new IllegalArgumentException("Verifier is not an active project member"));
        if (member.getRole() == null) {
            throw new IllegalArgumentException("Verifier is not an active project member");
        }
    }

    private Contribution contribution(UUID id) {
        return contributionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Contribution not found"));
    }

    private String hash(UUID contributionId, UUID verifierId, VerificationStatus status,
                        String comment, Instant decidedAt) {
        String value = contributionId + "|" + verifierId + "|" + status + "|" + comment + "|" + decidedAt;
        try {
            return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256")
                    .digest(value.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception exception) {
            throw new IllegalStateException("Unable to create decision hash", exception);
        }
    }

    private VerificationResponse map(Verification verification) {
        return VerificationResponse.builder()
                .verificationId(verification.getVerificationId())
                .contributionId(verification.getContribution().getContributionId())
                .verifierUserId(verification.getVerifierUser().getUserId())
                .verifierUsername(verification.getVerifierUser().getGithubUsername())
                .status(verification.getStatus()).comment(verification.getComment())
                .rejectionReason(verification.getRejectionReason())
                .requestedAt(verification.getRequestedAt()).decidedAt(verification.getDecidedAt())
                .decisionHash(verification.getDecisionHash()).build();
    }
}