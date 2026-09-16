package com.vouchgrid.backend.projects.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "repositories")
@IdClass(RepositoryId.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RepositoryEntity {

    @Id
    @Column(name = "project_id", nullable = false)
    private java.util.UUID projectId;

    @Id
    @Column(name = "provider", nullable = false, length = 30)
    private String provider;

    @Id
    @Column(name = "owner_name", nullable = false, length = 100)
    private String ownerName;

    @Id
    @Column(name = "repository_name", nullable = false, length = 150)
    private String repositoryName;

    @Column(name = "repository_url", nullable = false, length = 500)
    private String repositoryUrl;
}