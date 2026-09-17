package com.vouchgrid.backend.contributions.controller;

import com.vouchgrid.backend.common.security.SecurityUtils;
import com.vouchgrid.backend.contributions.dto.ContributionResponse;
import com.vouchgrid.backend.contributions.dto.CreateContributionRequest;
import com.vouchgrid.backend.contributions.service.ContributionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ContributionController {

    private final ContributionService contributionService;

    @PostMapping("/projects/{projectId}/contributions")
    @ResponseStatus(HttpStatus.CREATED)
    public ContributionResponse submit(
            @PathVariable UUID projectId,
            @Valid @RequestBody CreateContributionRequest request) {
        return contributionService.submit(projectId, currentUserId(), request);
    }

    @GetMapping("/projects/{projectId}/contributions")
    public List<ContributionResponse> projectContributions(@PathVariable UUID projectId) {
        return contributionService.listProject(projectId, currentUserId());
    }

    @GetMapping("/contributions/me")
    public List<ContributionResponse> myContributions() {
        return contributionService.listUser(currentUserId());
    }

    private UUID currentUserId() {
        return SecurityUtils.currentUser().getUser().getUserId();
    }
}