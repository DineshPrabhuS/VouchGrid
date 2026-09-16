package com.vouchgrid.backend.projects.service;

import java.util.List;
import java.util.UUID;

import com.vouchgrid.backend.projects.dto.AddProjectMemberRequest;
import com.vouchgrid.backend.projects.dto.ChangeProjectMemberRoleRequest;
import com.vouchgrid.backend.projects.dto.CreateProjectRequest;
import com.vouchgrid.backend.projects.dto.ProjectDetailResponse;
import com.vouchgrid.backend.projects.dto.ProjectMemberResponse;
import com.vouchgrid.backend.projects.dto.ProjectResponse;

public interface ProjectService {

    ProjectResponse createProject(
            CreateProjectRequest request,
            UUID userId
    );

    List<ProjectResponse> getMyProjects(
            UUID userId
    );

    ProjectDetailResponse getProject(
            UUID projectId,
            UUID userId
    );

    List<ProjectMemberResponse> getMembers(
            UUID projectId,
            UUID userId
    );

    ProjectMemberResponse addMember(
            UUID projectId,
            AddProjectMemberRequest request,
            UUID userId
    );

    void removeMember(
            UUID projectId,
            UUID memberUserId,
            UUID userId
    );

    ProjectMemberResponse changeMemberRole(
            UUID projectId,
            UUID memberUserId,
            ChangeProjectMemberRoleRequest request,
            UUID userId
    );
}