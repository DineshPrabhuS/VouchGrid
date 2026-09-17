package com.vouchgrid.backend.skills.repository;

import com.vouchgrid.backend.skills.entity.UserSkill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserSkillRepository extends JpaRepository<UserSkill, UUID> {

    List<UserSkill> findByUser_UserIdOrderByConfidenceScoreDesc(UUID userId);

    Optional<UserSkill> findByUser_UserIdAndSkill_Name(UUID userId, String skillName);
}