package com.vouchgrid.backend.skills.entity;

@Entity
@Table(name = "skills")
public class Skill {

    @Id
    @GeneratedValue
    private UUID id;

    private String name;

    private String category;
}