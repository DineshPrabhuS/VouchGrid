package com.vouchgrid.backend.projects.dto;

import com.vouchgrid.backend.projects.entity.ProjectRole;

import jakarta.validation.constraints.NotNull;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ChangeProjectMemberRoleRequest {

    @NotNull
    private ProjectRole role;
}