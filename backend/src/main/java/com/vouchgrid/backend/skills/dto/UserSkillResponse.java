package com.vouchgrid.backend.skills.dto;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class UserSkillResponse {

    String name;
    String category;
    Integer confidenceScore;
    Integer contributionCount;
    Boolean verified;
}