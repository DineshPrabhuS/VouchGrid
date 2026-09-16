package com.vouchgrid.backend.githubsync.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "github_repositories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GitHubRepository {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "github_repo_id", unique = true, nullable = false)
    private Long githubRepoId;

    private String name;

    @Column(name = "full_name")
    private String fullName;

    @Column(name = "html_url")
    private String htmlUrl;

    private String language;
}