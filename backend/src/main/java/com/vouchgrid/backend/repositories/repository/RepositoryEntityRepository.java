package com.vouchgrid.backend.repositories.repository;

import com.vouchgrid.backend.repositories.entity.RepositoryEntity;
import com.vouchgrid.backend.repositories.entity.RepositoryId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface RepositoryEntityRepository
        extends JpaRepository<RepositoryEntity, RepositoryId> {

    List<RepositoryEntity> findByProject_ProjectId(UUID projectId);

}