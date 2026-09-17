package com.vouchgrid.backend.githubsync.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.UUID;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class RepositoryCommitId implements Serializable {

    @Column(name = "project_id", nullable = false)
    private UUID projectId;

    @Column(name = "provider", nullable = false)
    private String provider;

    @Column(name = "owner_name", nullable = false)
    private String ownerName;

    @Column(name = "repository_name", nullable = false)
    private String repositoryName;

    @Column(name = "commit_sha", nullable = false)
    private String commitSha;
}