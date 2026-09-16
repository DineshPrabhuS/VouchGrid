package com.vouchgrid.backend.projects.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.vouchgrid.backend.projects.entity.Project;

public interface ProjectRepository
        extends JpaRepository<Project, UUID> {

}