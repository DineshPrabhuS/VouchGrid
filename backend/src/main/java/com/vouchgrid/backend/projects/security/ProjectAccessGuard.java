package com.vouchgrid.backend.projects.security;

import java.util.UUID;

import org.springframework.stereotype.Component;

import com.vouchgrid.backend.projects.entity.ProjectMember;
import com.vouchgrid.backend.projects.entity.ProjectRole;
import com.vouchgrid.backend.projects.repository.ProjectMemberRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ProjectAccessGuard {

    private final ProjectMemberRepository projectMemberRepository;

    public ProjectMember requireActiveMember(
            UUID projectId,
            UUID userId
    ) {

        ProjectMember member =
                projectMemberRepository
                        .findById(
                                new com.vouchgrid.backend.projects.entity.ProjectMemberId(
                                        projectId,
                                        userId
                                )
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User is not a member of this project"
                                )
                        );

        return member;
    }

    public ProjectMember requireLeader(
            UUID projectId,
            UUID userId
    ) {

        ProjectMember member =
                requireActiveMember(projectId, userId);

        if (member.getRole() != ProjectRole.LEADER) {
            throw new RuntimeException(
                    "Only the project leader can perform this action"
            );
        }

        return member;
    }
}