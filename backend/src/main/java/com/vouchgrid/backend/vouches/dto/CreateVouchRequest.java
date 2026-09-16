package com.vouchgrid.backend.vouches.dto;

import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateVouchRequest {

    @NotNull
    private UUID projectId;

    @NotNull
    private UUID recipientUserId;

    @NotBlank
    private String skill;

    @NotBlank
    private String message;
}