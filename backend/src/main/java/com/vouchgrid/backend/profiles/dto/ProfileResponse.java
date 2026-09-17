package com.vouchgrid.backend.profiles.dto;

import com.vouchgrid.backend.skills.dto.UserSkillResponse;
import lombok.Builder;
import lombok.Value;

import java.util.List;
import java.util.UUID;

@Value
@Builder
public class ProfileResponse {
    UUID userId;
    String githubUsername;
    String displayName;
    String bio;
    String avatarUrl;
    List<UserSkillResponse> skills;
    int contributionCount;
    int verifiedContributionCount;
    int projectCount;
}