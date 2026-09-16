package com.vouchgrid.backend.modules.repository;

import com.vouchgrid.backend.modules.entity.ModuleAssignment;
import com.vouchgrid.backend.modules.entity.ModuleAssignmentId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ModuleAssignmentRepository
        extends JpaRepository<ModuleAssignment, ModuleAssignmentId> {

    List<ModuleAssignment> findByUser_UserId(UUID userId);

    List<ModuleAssignment> findByModule_ModuleId(UUID moduleId);
}