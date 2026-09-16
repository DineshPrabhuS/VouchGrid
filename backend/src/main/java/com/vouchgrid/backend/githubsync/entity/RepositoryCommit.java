package com.vouchgrid.backend.githubsync.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "repository_commits")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RepositoryCommit {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false, unique = true)
    private String commitHash;

    private String author;

    @Column(length = 2000)
    private String message;

    private Instant commitDate;

    private String repositoryName;
}