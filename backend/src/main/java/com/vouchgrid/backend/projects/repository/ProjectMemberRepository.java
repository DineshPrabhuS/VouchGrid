package com.vouchgrid.backend.projects.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.vouchgrid.backend.projects.entity.ProjectMember;
import com.vouchgrid.backend.projects.entity.ProjectMemberId;

public interface ProjectMemberRepository
        extends JpaRepository<ProjectMember, ProjectMemberId> {

    List<ProjectMember> findByUser_UserId(UUID userId);
}