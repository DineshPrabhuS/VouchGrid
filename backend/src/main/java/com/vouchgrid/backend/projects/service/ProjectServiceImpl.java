package com.vouchgrid.backend.projects.service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vouchgrid.backend.projects.dto.CreateProjectRequest;
import com.vouchgrid.backend.projects.dto.ProjectResponse;
import com.vouchgrid.backend.projects.entity.Project;
import com.vouchgrid.backend.projects.entity.ProjectMember;
import com.vouchgrid.backend.projects.entity.ProjectMemberId;
import com.vouchgrid.backend.projects.entity.ProjectRole;
import com.vouchgrid.backend.projects.repository.ProjectMemberRepository;
import com.vouchgrid.backend.projects.repository.ProjectRepository;
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

        Project savedProject = projectRepository.save(project);

        ProjectMember leader = ProjectMember.builder()
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

        return toResponse(savedProject);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectResponse> getMyProjects(UUID userId) {

        List<ProjectMember> memberships =
                projectMemberRepository.findByUser_UserId(userId);

        return memberships.stream()
                .map(ProjectMember::getProject)
                .map(this::toResponse)
                .toList();
    }

    private ProjectResponse toResponse(Project project) {

        return ProjectResponse.builder()
                .projectId(project.getProjectId())
                .name(project.getName())
                .description(project.getDescription())
                .createdBy(project.getCreatedBy().getUserId())
                .createdAt(project.getCreatedAt())
                .build();
    }
}