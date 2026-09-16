package com.vouchgrid.backend.vouches.dto;

import java.time.Instant;
import java.util.UUID;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class VouchResponse {

    private UUID vouchId;

    private UUID projectId;

    private UUID authorUserId;
    private String authorUsername;

    private UUID recipientUserId;
    private String recipientUsername;

    private String skill;
    private String message;

    private Instant createdAt;
}