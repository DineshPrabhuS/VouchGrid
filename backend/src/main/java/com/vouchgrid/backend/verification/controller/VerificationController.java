package com.vouchgrid.backend.verification.controller;

import com.vouchgrid.backend.common.security.SecurityUtils;
import com.vouchgrid.backend.verification.dto.DecisionRequest;
import com.vouchgrid.backend.verification.dto.VerificationRequest;
import com.vouchgrid.backend.verification.dto.VerificationResponse;
import com.vouchgrid.backend.verification.service.VerificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class VerificationController {

    private final VerificationService verificationService;

    @PostMapping("/contributions/{contributionId}/verification")
    public VerificationResponse request(
            @PathVariable UUID contributionId,
            @RequestBody VerificationRequest request) {
        return verificationService.request(contributionId, currentUserId(), request);
    }

    @PostMapping("/verifications/{verificationId}/approve")
    public VerificationResponse approve(
            @PathVariable UUID verificationId,
            @Valid @RequestBody DecisionRequest request) {
        return verificationService.decide(verificationId, currentUserId(), true, request);
    }

    @PostMapping("/verifications/{verificationId}/reject")
    public VerificationResponse reject(
            @PathVariable UUID verificationId,
            @Valid @RequestBody DecisionRequest request) {
        return verificationService.decide(verificationId, currentUserId(), false, request);
    }

    @GetMapping("/contributions/{contributionId}/verification")
    public VerificationResponse get(@PathVariable UUID contributionId) {
        return verificationService.get(contributionId, currentUserId());
    }

    private UUID currentUserId() {
        return SecurityUtils.currentUser().getUser().getUserId();
    }
}