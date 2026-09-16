package com.vouchgrid.backend.modules.service;

import com.vouchgrid.backend.modules.dto.AssignModuleRequest;
import com.vouchgrid.backend.modules.dto.CreateModuleRequest;
import com.vouchgrid.backend.modules.dto.ModuleResponse;
import com.vouchgrid.backend.modules.entity.Module;
import com.vouchgrid.backend.modules.entity.ModuleAssignment;
import com.vouchgrid.backend.modules.entity.ModuleAssignmentId;
import com.vouchgrid.backend.modules.entity.ModuleStatus;
import com.vouchgrid.backend.modules.repository.ModuleAssignmentRepository;
import com.vouchgrid.backend.modules.repository.ModuleRepository;
import com.vouchgrid.backend.projects.entity.Project;
import com.vouchgrid.backend.projects.repository.ProjectRepository;
import com.vouchgrid.backend.projects.security.ProjectAccessGuard;
import com.vouchgrid.backend.users.entity.User;
import com.vouchgrid.backend.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class ModuleServiceImpl implements ModuleService {

    private final ModuleRepository moduleRepository;
    private final ModuleAssignmentRepository assignmentRepository;

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    private final ProjectAccessGuard accessGuard;

    @Override
    public ModuleResponse createModule(
            UUID projectId,
            UUID currentUserId,
            CreateModuleRequest request
    ) {

        accessGuard.requireLeader(
                projectId,
                currentUserId
        );

        Project project =
                projectRepository.findById(projectId)
                        .orElseThrow(() ->
                                new RuntimeException("Project not found"));

        Module module =
                Module.builder()
                        .moduleId(UUID.randomUUID())
                        .project(project)
                        .title(request.getTitle())
                        .description(request.getDescription())
                        .status(ModuleStatus.UNASSIGNED)
                        .createdAt(Instant.now())
                        .build();

        moduleRepository.save(module);

        return map(module);
    }

    @Override
    public ModuleResponse assignModule(
            UUID moduleId,
            UUID currentUserId,
            AssignModuleRequest request
    ) {

        Module module =
                moduleRepository.findById(moduleId)
                        .orElseThrow(() ->
                                new RuntimeException("Module not found"));

        UUID projectId =
                module.getProject().getProjectId();

        accessGuard.requireLeader(
                projectId,
                currentUserId
        );

        User user =
                userRepository.findById(
                                request.getUserId())
                        .orElseThrow(() ->
                                new RuntimeException("User not found"));

        ModuleAssignment assignment =
                ModuleAssignment.builder()
                        .id(
                                new ModuleAssignmentId(
                                        moduleId,
                                        user.getUserId()
                                )
                        )
                        .module(module)
                        .user(user)
                        .assignedAt(Instant.now())
                        .build();

        assignmentRepository.save(assignment);

        module.setStatus(
                ModuleStatus.IN_PROGRESS
        );

        return map(module);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ModuleResponse> getModules(
            UUID projectId,
            UUID currentUserId
    ) {

        accessGuard.requireActiveMember(
                projectId,
                currentUserId
        );

        return moduleRepository
                .findByProject_ProjectId(projectId)
                .stream()
                .map(this::map)
                .toList();
    }

    private ModuleResponse map(
            Module module
    ) {

        return ModuleResponse.builder()
                .moduleId(module.getModuleId())
                .projectId(
                        module.getProject()
                                .getProjectId()
                )
                .title(module.getTitle())
                .description(module.getDescription())
                .status(module.getStatus())
                .createdAt(module.getCreatedAt())
                .build();
    }
}