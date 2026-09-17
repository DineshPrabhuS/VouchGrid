package com.vouchgrid.backend.skills.repository;

import com.vouchgrid.backend.skills.entity.Skill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface SkillRepository extends JpaRepository<Skill, UUID> {

    Optional<Skill> findByName(String name);
}