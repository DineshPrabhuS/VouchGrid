package com.vouchgrid.backend.vouches.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.vouchgrid.backend.vouches.entity.Vouch;

public interface VouchRepository
        extends JpaRepository<Vouch, UUID> {

    List<Vouch> findByProject_ProjectId(UUID projectId);

    List<Vouch> findByRecipient_UserId(UUID userId);
}