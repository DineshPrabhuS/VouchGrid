package com.vouchgrid.backend.profiles.controller;

import com.vouchgrid.backend.common.security.SecurityUtils;
import com.vouchgrid.backend.profiles.dto.CertificateResponse;
import com.vouchgrid.backend.profiles.dto.ProfileResponse;
import com.vouchgrid.backend.profiles.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/profiles")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping("/{userId}")
    public ProfileResponse profile(@PathVariable UUID userId) {
        return profileService.getProfile(userId);
    }

    @GetMapping("/{userId}/certificate")
    public CertificateResponse certificate(@PathVariable UUID userId) {
        requireCurrentUser(userId);
        return profileService.certificate(userId);
    }

    private void requireCurrentUser(UUID userId) {
        if (!SecurityUtils.currentUser().getUser().getUserId().equals(userId)) {
            throw new IllegalArgumentException("A user can only export their own certificate");
        }
    }
}