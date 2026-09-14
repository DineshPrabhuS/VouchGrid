package com.vouchgrid.backend.users.repository;

import com.vouchgrid.backend.users.entity.GithubConnection;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface GithubConnectionRepository
        extends JpaRepository<GithubConnection, UUID> {
}