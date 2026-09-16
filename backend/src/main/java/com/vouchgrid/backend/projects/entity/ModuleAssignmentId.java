package com.vouchgrid.backend.projects.entity;

import java.io.Serializable;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ModuleAssignmentId implements Serializable {

    @Column(name = "module_id", nullable = false)
    private UUID moduleId;

    @Column(name = "user_id", nullable = false)
    private UUID userId;
}