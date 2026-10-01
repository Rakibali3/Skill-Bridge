package com.SkillBridge.skillbridge.repository;

import com.SkillBridge.skillbridge.entity.UserLearningPath;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserLearningPathRepository extends JpaRepository<UserLearningPath, Long> {
    Optional<UserLearningPath> findByUserIdAndLearningPathId(Long userId, Long learningPathId);
    boolean existsByUserIdAndLearningPathId(Long userId, Long learningPathId);
}