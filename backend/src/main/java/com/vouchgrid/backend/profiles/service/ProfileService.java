package com.vouchgrid.backend.profiles.service;

import com.vouchgrid.backend.contributions.entity.Contribution;
import com.vouchgrid.backend.contributions.entity.ContributionStatus;
import com.vouchgrid.backend.contributions.repository.ContributionRepository;
import com.vouchgrid.backend.githubsync.entity.RepositoryCommitId;
import com.vouchgrid.backend.githubsync.repository.RepositoryCommitRepository;
import com.vouchgrid.backend.profiles.dto.CertificateResponse;
import com.vouchgrid.backend.profiles.dto.ProfileResponse;
import com.vouchgrid.backend.projects.repository.ProjectMemberRepository;
import com.vouchgrid.backend.skills.dto.UserSkillResponse;
import com.vouchgrid.backend.skills.service.SkillGenerationService;
import com.vouchgrid.backend.users.entity.User;
import com.vouchgrid.backend.users.repository.UserRepository;
import com.vouchgrid.backend.verification.entity.Verification;
import com.vouchgrid.backend.verification.repository.VerificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final UserRepository userRepository;
    private final ContributionRepository contributionRepository;
    private final VerificationRepository verificationRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final RepositoryCommitRepository commitRepository;
    private final SkillGenerationService skillGenerationService;

    @Transactional(readOnly = true)
    public ProfileResponse getProfile(UUID userId) {
        User user = user(userId);
        List<Contribution> contributions = contributionRepository.findByUser_UserIdOrderByCreatedAtDesc(userId);
        List<UserSkillResponse> skills = skillGenerationService.getSkills(userId);
        return ProfileResponse.builder()
                .userId(userId).githubUsername(user.getGithubUsername())
                .displayName(user.getDisplayName()).bio(user.getBio()).avatarUrl(user.getAvatarUrl())
                .skills(skills).contributionCount(contributions.size())
                .verifiedContributionCount((int) contributions.stream()
                        .filter(item -> item.getStatus() == ContributionStatus.VERIFIED).count())
                .projectCount(projectMemberRepository.findByUser_UserId(userId).size())
                .build();
    }

    @Transactional(readOnly = true)
    public CertificateResponse certificate(UUID userId) {
        User user = user(userId);
        List<CertificateResponse.CertificateContribution> items = contributionRepository
                .findByUser_UserIdAndStatus(userId, ContributionStatus.VERIFIED)
                .stream().map(this::certificateContribution).toList();
        return CertificateResponse.builder()
                .certificateVersion("1.0")
                .userId(userId).githubUsername(user.getGithubUsername())
                .displayName(user.getDisplayName()).issuedAt(Instant.now())
                .contributions(items).build();
    }

    private CertificateResponse.CertificateContribution certificateContribution(Contribution contribution) {
        Verification verification = verificationRepository
                .findByContribution_ContributionId(contribution.getContributionId()).orElse(null);
        String message = commitRepository.findById(new RepositoryCommitId(
                        contribution.getProject().getProjectId(), contribution.getProvider(),
                        contribution.getOwnerName(), contribution.getRepositoryName(), contribution.getCommitSha()))
                .map(commit -> commit.getMessage()).orElse(contribution.getEvidence());
        return CertificateResponse.CertificateContribution.builder()
                .contributionId(contribution.getContributionId())
                .projectName(contribution.getProject().getName())
                .repository(contribution.getOwnerName() + "/" + contribution.getRepositoryName())
                .commitSha(contribution.getCommitSha()).commitMessage(message)
                .status(contribution.getStatus().name())
                .decisionHash(verification == null ? null : verification.getDecisionHash())
                .verifier(verification == null ? null : verification.getVerifierUser().getGithubUsername())
                .build();
    }

    private User user(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }
}