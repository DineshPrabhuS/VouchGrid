package com.vouchgrid.backend.skills.service;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vouchgrid.backend.contributions.entity.Contribution;
import com.vouchgrid.backend.contributions.entity.ContributionStatus;
import com.vouchgrid.backend.contributions.repository.ContributionRepository;
import com.vouchgrid.backend.githubsync.entity.RepositoryCommit;
import com.vouchgrid.backend.githubsync.entity.RepositoryCommitId;
import com.vouchgrid.backend.githubsync.repository.RepositoryCommitRepository;
import com.vouchgrid.backend.projects.repository.ProjectMemberRepository;
import com.vouchgrid.backend.skills.dto.UserSkillResponse;
import com.vouchgrid.backend.skills.engine.SkillEvidence;
import com.vouchgrid.backend.skills.engine.SkillRule;
import com.vouchgrid.backend.skills.entity.Skill;
import com.vouchgrid.backend.skills.entity.UserSkill;
import com.vouchgrid.backend.skills.repository.SkillRepository;
import com.vouchgrid.backend.skills.repository.UserSkillRepository;
import com.vouchgrid.backend.users.entity.User;
import com.vouchgrid.backend.users.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SkillGenerationService {

    private final UserRepository userRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final RepositoryCommitRepository commitRepository;
    private final SkillRepository skillRepository;
    private final UserSkillRepository userSkillRepository;
    private final List<SkillRule> skillRules;
    private final ContributionRepository contributionRepository;

    @Transactional
    public List<UserSkillResponse> generateSkills(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Map<String, Integer> counts = new HashMap<>();
        Map<String, Integer> verifiedCounts = new HashMap<>();
        Set<UUID> projectIds = new HashSet<>();
        projectMemberRepository.findByUser_UserId(userId)
                .forEach(member -> projectIds.add(member.getProject().getProjectId()));

        for (UUID projectId : projectIds) {
            for (RepositoryCommit commit : commitRepository.findByIdProjectId(projectId)) {
                SkillEvidence evidence = new SkillEvidence(
                        commit.getMessage(),
                        commit.getChangedFiles() == null || commit.getChangedFiles().isBlank()
                                ? List.of()
                                : List.of(commit.getChangedFiles().split("\\R")),
                        commit.getDiffContent(),
                        commit.getAdditions() == null ? 0 : commit.getAdditions(),
                        commit.getDeletions() == null ? 0 : commit.getDeletions());
                for (SkillRule rule : skillRules) {
                    for (String skillName : rule.detect(evidence)) {
                        counts.merge(skillName, 1, Integer::sum);
                    }
                }
            }
        }

        for (Contribution contribution : contributionRepository
            .findByUser_UserIdAndStatus(userId, ContributionStatus.VERIFIED)) {
            RepositoryCommitId commitId = new RepositoryCommitId(
                contribution.getProject().getProjectId(), contribution.getProvider(),
                contribution.getOwnerName(), contribution.getRepositoryName(), contribution.getCommitSha());
            commitRepository.findById(commitId).ifPresent(commit -> {
            SkillEvidence evidence = evidence(commit);
            skillRules.forEach(rule -> rule.detect(evidence)
                .forEach(skill -> verifiedCounts.merge(skill, 1, Integer::sum)));
            });
        }

        for (Map.Entry<String, Integer> entry : counts.entrySet()) {
            Skill skill = skillRepository.findByName(entry.getKey()).orElse(null);
            if (skill == null) {
                continue;
            }
            UserSkill userSkill = userSkillRepository
                    .findByUser_UserIdAndSkill_Name(userId, skill.getName())
                    .orElseGet(() -> UserSkill.builder()
                            .user(user)
                            .skill(skill)
                            .verified(false)
                            .build());
            userSkill.setContributionCount(entry.getValue());
            int verifiedEvidence = verifiedCounts.getOrDefault(entry.getKey(), 0);
            userSkill.setConfidenceScore(Math.min(100, entry.getValue() * 10 + verifiedEvidence * 50));
            userSkill.setVerified(verifiedEvidence > 0);
            userSkillRepository.save(userSkill);
        }

        return getSkills(userId);
    }

    @Transactional(readOnly = true)
    public List<UserSkillResponse> getSkills(UUID userId) {
        return userSkillRepository.findByUser_UserIdOrderByConfidenceScoreDesc(userId)
                .stream()
                .map(userSkill -> UserSkillResponse.builder()
                        .name(userSkill.getSkill().getName())
                        .category(userSkill.getSkill().getCategory())
                        .confidenceScore(userSkill.getConfidenceScore())
                        .contributionCount(userSkill.getContributionCount())
                        .verified(userSkill.getVerified())
                        .build())
                .toList();
    }

    private SkillEvidence evidence(RepositoryCommit commit) {
        return new SkillEvidence(
                commit.getMessage(),
                commit.getChangedFiles() == null || commit.getChangedFiles().isBlank()
                        ? List.of() : List.of(commit.getChangedFiles().split("\\R")),
                commit.getDiffContent(),
                commit.getAdditions() == null ? 0 : commit.getAdditions(),
                commit.getDeletions() == null ? 0 : commit.getDeletions());
    }
}