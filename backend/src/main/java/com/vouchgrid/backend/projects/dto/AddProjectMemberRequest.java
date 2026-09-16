package com.vouchgrid.backend.projects.dto;

import java.util.UUID;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class AddProjectMemberRequest {

    @NotNull
    private UUID userId;
}