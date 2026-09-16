package com.vouchgrid.backend.repositories.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;
import java.util.UUID;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class RepositoryId implements Serializable {

    @Column(name = "project_id")
    private UUID projectId;

    @Column(name = "provider")
    private String provider;

    @Column(name = "owner_name")
    private String ownerName;

    @Column(name = "repository_name")
    private String repositoryName;
}