package com.vouchgrid.backend.repositories.entity;

import com.vouchgrid.backend.projects.entity.Project;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "repositories")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RepositoryEntity {

    @EmbeddedId
    private RepositoryId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("projectId")
    @JoinColumn(name = "project_id")
    private Project project;

    @Column(name = "created_at")
    private Instant createdAt;
}