package com.vouchgrid.backend.users.entity;

import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "github_connections")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GithubConnection {

    @Id
    @Column(name = "connection_id")
    private UUID connectionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "github_user_id", nullable = false)
    private Long githubUserId;

    @Column(name = "github_username", nullable = false)
    private String githubUsername;

    @Column(name = "access_token")
    private String accessToken;

    @Column(name = "connected_at")
    private Instant connectedAt;

    @PrePersist
    public void prePersist() {

        if (connectionId == null) {
            connectionId = UUID.randomUUID();
        }

        connectedAt = Instant.now();
    }
}