package com.vouchgrid.backend.projects.entity;

import java.io.Serializable;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RepositoryId implements Serializable {

    private UUID projectId;

    private String provider;

    private String ownerName;

    private String repositoryName;
}