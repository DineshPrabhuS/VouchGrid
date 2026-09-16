package com.vouchgrid.backend.projects.service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vouchgrid.backend.projects.dto.AddProjectMemberRequest;
import com.vouchgrid.backend.projects.dto.ChangeProjectMemberRoleRequest;
import com.vouchgrid.backend.projects.dto.CreateProjectRequest;
import com.vouchgrid.backend.projects.dto.ProjectDetailResponse;
import com.vouchgrid.backend.projects.dto.ProjectMemberResponse;
import com.vouchgrid.backend.projects.dto.ProjectResponse;
import com.vouchgrid.backend.projects.entity.Project;
import com.vouchgrid.backend.projects.entity.ProjectMember;
import com.vouchgrid.backend.projects.entity.ProjectMemberId;
import com.vouchgrid.backend.projects.entity.ProjectRole;
import com.vouchgrid.backend.projects.repository.ProjectMemberRepository;
import com.vouchgrid.backend.projects.repository.ProjectRepository;
import com.vouchgrid.backend.projects.security.ProjectAccessGuard;
import com.vouchgrid.backend.users.entity.User;
import com.vouchgrid.backend.users.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;

    private final ProjectMemberRepository projectMemberRepository;

    private final UserRepository userRepository;

    private final ProjectAccessGuard projectAccessGuard;

    @Override
    public ProjectResponse createProject(
            CreateProjectRequest request,
            UUID userId
    ) {

        User creator = userRepository
                .findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        Project project = Project.builder()
                .projectId(UUID.randomUUID())
                .name(request.getName())
                .description(request.getDescription())
                .createdBy(creator)
                .createdAt(Instant.now())
                .build();

        Project savedProject =
                projectRepository.save(project);

        ProjectMember leader =
                ProjectMember.builder()
                        .id(
                                new ProjectMemberId(
                                        savedProject.getProjectId(),
                                        creator.getUserId()
                                )
                        )
                        .project(savedProject)
                        .user(creator)
                        .role(ProjectRole.LEADER)
                        .joinedAt(Instant.now())
                        .build();

        projectMemberRepository.save(leader);

        return toProjectResponse(savedProject);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectResponse> getMyProjects(
            UUID userId
    ) {

        List<ProjectMember> memberships =
                projectMemberRepository
                        .findByUser_UserId(userId);

        return memberships.stream()
                .map(ProjectMember::getProject)
                .map(this::toProjectResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ProjectDetailResponse getProject(
            UUID projectId,
            UUID userId
    ) {

        projectAccessGuard.requireActiveMember(
                projectId,
                userId
        );

        Project project =
                projectRepository
                        .findById(projectId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Project not found"
                                )
                        );

        return ProjectDetailResponse.builder()
                .projectId(project.getProjectId())
                .name(project.getName())
                .description(project.getDescription())
                .createdBy(
                        project.getCreatedBy()
                                .getUserId()
                )
                .createdAt(project.getCreatedAt())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectMemberResponse> getMembers(
            UUID projectId,
            UUID userId
    ) {

        projectAccessGuard.requireActiveMember(
                projectId,
                userId
        );

        return projectMemberRepository
                .findByProject_ProjectId(projectId)
                .stream()
                .map(this::toMemberResponse)
                .toList();
    }

    @Override
    public ProjectMemberResponse addMember(
            UUID projectId,
            AddProjectMemberRequest request,
            UUID userId
    ) {

        projectAccessGuard.requireLeader(
                projectId,
                userId
        );

        User newUser =
                userRepository
                        .findById(request.getUserId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );

        Project project =
                projectRepository
                        .findById(projectId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Project not found"
                                )
                        );

        ProjectMemberId memberId =
                new ProjectMemberId(
                        projectId,
                        newUser.getUserId()
                );

        if (projectMemberRepository
                .existsById(memberId)) {

            throw new RuntimeException(
                    "User is already a member of this project"
            );
        }

        ProjectMember member =
                ProjectMember.builder()
                        .id(memberId)
                        .project(project)
                        .user(newUser)
                        .role(ProjectRole.MEMBER)
                        .joinedAt(Instant.now())
                        .build();

        ProjectMember savedMember =
                projectMemberRepository.save(member);

        return toMemberResponse(savedMember);
    }

    @Override
    public void removeMember(
            UUID projectId,
            UUID memberUserId,
            UUID userId
    ) {

        projectAccessGuard.requireLeader(
                projectId,
                userId
        );

        if (memberUserId.equals(userId)) {

            throw new RuntimeException(
                    "Project leader cannot remove themselves"
            );
        }

        ProjectMemberId memberId =
                new ProjectMemberId(
                        projectId,
                        memberUserId
                );

        ProjectMember member =
                projectMemberRepository
                        .findById(memberId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Project member not found"
                                )
                        );

        projectMemberRepository.delete(member);
    }

    @Override
    public ProjectMemberResponse changeMemberRole(
            UUID projectId,
            UUID memberUserId,
            ChangeProjectMemberRoleRequest request,
            UUID userId
    ) {

        projectAccessGuard.requireLeader(
                projectId,
                userId
        );

        ProjectMemberId memberId =
                new ProjectMemberId(
                        projectId,
                        memberUserId
                );

        ProjectMember member =
                projectMemberRepository
                        .findById(memberId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Project member not found"
                                )
                        );

        if (memberUserId.equals(userId)
                && request.getRole() != ProjectRole.LEADER) {

            throw new RuntimeException(
                    "Project leader cannot remove their own leader role"
            );
        }

        member.setRole(request.getRole());

        ProjectMember savedMember =
                projectMemberRepository.save(member);

        return toMemberResponse(savedMember);
    }

    private ProjectResponse toProjectResponse(
            Project project
    ) {

        return ProjectResponse.builder()
                .projectId(project.getProjectId())
                .name(project.getName())
                .description(project.getDescription())
                .createdBy(
                        project.getCreatedBy()
                                .getUserId()
                )
                .createdAt(project.getCreatedAt())
                .build();
    }

    private ProjectMemberResponse toMemberResponse(
            ProjectMember member
    ) {

        return ProjectMemberResponse.builder()
                .userId(
                        member.getUser()
                                .getUserId()
                )
                .name(
                        member.getUser()
                                .getDisplayName()
                )
                .email(
                        member.getUser()
                                .getEmail()
                )
                .role(member.getRole())
                .joinedAt(member.getJoinedAt())
                .build();
    }
}