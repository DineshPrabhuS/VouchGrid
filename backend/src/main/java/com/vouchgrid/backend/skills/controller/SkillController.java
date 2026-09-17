package com.vouchgrid.backend.skills.controller;

import com.vouchgrid.backend.common.security.SecurityUtils;
import com.vouchgrid.backend.skills.dto.UserSkillResponse;
import com.vouchgrid.backend.skills.service.SkillGenerationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/skills")
@RequiredArgsConstructor
public class SkillController {

    private final SkillGenerationService skillGenerationService;

    @PostMapping("/generate/{userId}")
    public List<UserSkillResponse> generate(@PathVariable UUID userId) {
        requireCurrentUser(userId);
        return skillGenerationService.generateSkills(userId);
    }

    @GetMapping("/user/{userId}")
    public List<UserSkillResponse> getSkills(@PathVariable UUID userId) {
        requireCurrentUser(userId);
        return skillGenerationService.getSkills(userId);
    }

    private void requireCurrentUser(UUID userId) {
        if (!SecurityUtils.currentUser().getUser().getUserId().equals(userId)) {
            throw new IllegalArgumentException("A user can only access their own skills");
        }
    }
}