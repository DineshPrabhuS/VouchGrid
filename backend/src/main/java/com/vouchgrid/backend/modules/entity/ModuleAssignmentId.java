package com.vouchgrid.backend.modules.entity;

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
public class ModuleAssignmentId implements Serializable {

    @Column(name = "module_id")
    private UUID moduleId;

    @Column(name = "user_id")
    private UUID userId;
}