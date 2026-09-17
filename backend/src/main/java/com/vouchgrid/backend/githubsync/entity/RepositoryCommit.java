package com.vouchgrid.backend.githubsync.entity;

import java.time.Instant;

import com.vouchgrid.backend.repositories.entity.RepositoryEntity;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinColumns;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "repository_commits")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RepositoryCommit {

    @EmbeddedId
    private RepositoryCommitId id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumns({
            @JoinColumn(name = "project_id", referencedColumnName = "project_id", insertable = false, updatable = false),
            @JoinColumn(name = "provider", referencedColumnName = "provider", insertable = false, updatable = false),
            @JoinColumn(name = "owner_name", referencedColumnName = "owner_name", insertable = false, updatable = false),
            @JoinColumn(name = "repository_name", referencedColumnName = "repository_name", insertable = false, updatable = false)
    })
    private RepositoryEntity repository;

    private String author;

    @Column(length = 2000)
    private String message;

    @Column(name = "commit_date")
    private Instant commitDate;

    @Column(name = "changed_files", columnDefinition = "TEXT")
    private String changedFiles;

    @Column(name = "diff_content", columnDefinition = "MEDIUMTEXT")
    private String diffContent;

    @Column(name = "additions")
    private Integer additions;

    @Column(name = "deletions")
    private Integer deletions;
}