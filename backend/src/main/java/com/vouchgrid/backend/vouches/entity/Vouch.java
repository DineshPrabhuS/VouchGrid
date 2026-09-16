package com.vouchgrid.backend.vouches.entity;

import java.time.Instant;
import java.util.UUID;

import com.vouchgrid.backend.projects.entity.Project;
import com.vouchgrid.backend.users.entity.User;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "vouches")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Vouch {

    @Id
    @Column(name = "vouch_id")
    private UUID vouchId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_user_id")
    private User author;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipient_user_id")
    private User recipient;

    @Column(nullable = false)
    private String skill;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(name = "created_at")
    private Instant createdAt;
}