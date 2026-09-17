package com.vouchgrid.backend.verification.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DecisionRequest {
    @NotBlank private String comment;
    private String rejectionReason;
}