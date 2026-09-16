package com.vouchgrid.backend.modules.entity;

import com.vouchgrid.backend.projects.entity.Project;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "modules")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Module {

    @Id
    @Column(name = "module_id")
    private UUID moduleId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    private Project project;

    private String title;

    private String description;

    @Enumerated(EnumType.STRING)
    private ModuleStatus status;

    @Column(name = "created_at")
    private Instant createdAt;
}