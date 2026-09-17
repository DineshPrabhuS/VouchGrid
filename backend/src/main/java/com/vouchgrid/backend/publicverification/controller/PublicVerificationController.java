package com.vouchgrid.backend.publicverification.controller;

import com.vouchgrid.backend.contributions.entity.Contribution;
import com.vouchgrid.backend.contributions.repository.ContributionRepository;
import com.vouchgrid.backend.githubsync.entity.RepositoryCommitId;
import com.vouchgrid.backend.githubsync.repository.RepositoryCommitRepository;
import com.vouchgrid.backend.publicverification.dto.PublicVerificationResponse;
import com.vouchgrid.backend.verification.repository.VerificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicVerificationController {

    private final ContributionRepository contributionRepository;
    private final VerificationRepository verificationRepository;
    private final RepositoryCommitRepository commitRepository;

    @GetMapping("/verify/{publicToken}")
    public PublicVerificationResponse verify(@PathVariable String publicToken) {
        Contribution contribution = contributionRepository.findByPublicToken(publicToken)
                .orElseThrow(() -> new IllegalArgumentException("Public verification not found"));
        var verification = verificationRepository
                .findByContribution_ContributionId(contribution.getContributionId()).orElse(null);
        String message = commitRepository.findById(new RepositoryCommitId(
                        contribution.getProject().getProjectId(), contribution.getProvider(),
                        contribution.getOwnerName(), contribution.getRepositoryName(), contribution.getCommitSha()))
                .map(commit -> commit.getMessage()).orElse(null);
        return PublicVerificationResponse.builder()
                .contributionId(contribution.getContributionId())
                .contributor(contribution.getUser().getGithubUsername())
                .project(contribution.getProject().getName())
                .repository(contribution.getOwnerName() + "/" + contribution.getRepositoryName())
                .commitSha(contribution.getCommitSha()).commitMessage(message)
                .contributionTitle(contribution.getTitle()).status(contribution.getStatus().name())
                .verifier(verification == null ? null : verification.getVerifierUser().getGithubUsername())
                .comment(verification == null ? null : verification.getComment())
                .decisionHash(verification == null ? null : verification.getDecisionHash())
                .decidedAt(verification == null ? null : verification.getDecidedAt())
                .build();
    }
}