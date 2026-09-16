package com.vouchgrid.backend.projects.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vouchgrid.backend.common.security.SecurityUtils;
import com.vouchgrid.backend.projects.dto.AddProjectMemberRequest;
import com.vouchgrid.backend.projects.dto.ChangeProjectMemberRoleRequest;
import com.vouchgrid.backend.projects.dto.CreateProjectRequest;
import com.vouchgrid.backend.projects.dto.ProjectDetailResponse;
import com.vouchgrid.backend.projects.dto.ProjectMemberResponse;
import com.vouchgrid.backend.projects.dto.ProjectResponse;
import com.vouchgrid.backend.projects.service.ProjectService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @PostMapping
    public ResponseEntity<ProjectResponse> createProject(
            @Valid @RequestBody CreateProjectRequest request
    ) {

        UUID userId = getCurrentUserId();

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(projectService.createProject(request, userId));
    }

    @GetMapping
    public ResponseEntity<List<ProjectResponse>> getMyProjects() {

        UUID userId = getCurrentUserId();

        return ResponseEntity.ok(
                projectService.getMyProjects(userId)
        );
    }

    @GetMapping("/{projectId}")
    public ResponseEntity<ProjectDetailResponse> getProject(
            @PathVariable UUID projectId
    ) {

        UUID userId = getCurrentUserId();

        return ResponseEntity.ok(
                projectService.getProject(projectId, userId)
        );
    }

    @GetMapping("/{projectId}/members")
    public ResponseEntity<List<ProjectMemberResponse>> getMembers(
            @PathVariable UUID projectId
    ) {

        UUID userId = getCurrentUserId();

        return ResponseEntity.ok(
                projectService.getMembers(projectId, userId)
        );
    }

    @PostMapping("/{projectId}/members")
    public ResponseEntity<ProjectMemberResponse> addMember(
            @PathVariable UUID projectId,
            @Valid @RequestBody AddProjectMemberRequest request
    ) {

        UUID userId = getCurrentUserId();

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        projectService.addMember(
                                projectId,
                                request,
                                userId
                        )
                );
    }

    @DeleteMapping("/{projectId}/members/{memberUserId}")
    public ResponseEntity<Void> removeMember(
            @PathVariable UUID projectId,
            @PathVariable UUID memberUserId
    ) {

        UUID userId = getCurrentUserId();

        projectService.removeMember(
                projectId,
                memberUserId,
                userId
        );

        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{projectId}/members/{memberUserId}/role")
    public ResponseEntity<ProjectMemberResponse> changeMemberRole(
            @PathVariable UUID projectId,
            @PathVariable UUID memberUserId,
            @Valid @RequestBody ChangeProjectMemberRoleRequest request
    ) {

        UUID userId = getCurrentUserId();

        return ResponseEntity.ok(
                projectService.changeMemberRole(
                        projectId,
                        memberUserId,
                        request,
                        userId
                )
        );
    }

    private UUID getCurrentUserId() {
        return SecurityUtils
                .currentUser()
                .getUser()
                .getUserId();
    }
}