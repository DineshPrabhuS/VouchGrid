package com.vouchgrid.backend.contributions.entity;

import com.vouchgrid.backend.modules.entity.Module;
import com.vouchgrid.backend.projects.entity.Project;
import com.vouchgrid.backend.users.entity.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "contributions")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Contribution {

    @Id
    @Column(name = "contribution_id", nullable = false)
    private UUID contributionId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "module_id")
    private Module module;

    @Column(nullable = false, length = 50)
    private String provider;

    @Column(name = "owner_name", nullable = false, length = 191)
    private String ownerName;

    @Column(name = "repository_name", nullable = false, length = 191)
    private String repositoryName;

    @Column(name = "commit_sha", nullable = false, length = 191)
    private String commitSha;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String evidence;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ContributionStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "revision_of_id")
    private Contribution revisionOf;

    @Column(name = "public_token", nullable = false, unique = true, length = 64)
    private String publicToken;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @PrePersist
    void prePersist() {
        if (contributionId == null) contributionId = UUID.randomUUID();
        if (publicToken == null) publicToken = UUID.randomUUID().toString().replace("-", "");
        if (createdAt == null) createdAt = Instant.now();
        updatedAt = createdAt;
    }

    @PreUpdate
    void preUpdate() {
        updatedAt = Instant.now();
    }
}