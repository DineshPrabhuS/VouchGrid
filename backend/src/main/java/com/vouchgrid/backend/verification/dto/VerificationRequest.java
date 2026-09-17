package com.vouchgrid.backend.verification.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class VerificationRequest {
    private UUID verifierUserId;
}