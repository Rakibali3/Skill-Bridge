package com.SkillBridge.skillbridge.repository;

import com.SkillBridge.skillbridge.entity.LearningPath;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LearningPathRepository
        extends JpaRepository<LearningPath, Long> {

    Optional<LearningPath> findBySkillId(Long skillId);

    boolean existsBySkillId(Long skillId);

    List<LearningPath> findAllByOrderByCreatedAtDesc();
}