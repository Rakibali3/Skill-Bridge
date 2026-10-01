package com.SkillBridge.skillbridge.repository;

import com.SkillBridge.skillbridge.entity.UserLearningPathTopic;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserLearningPathTopicRepository extends JpaRepository<UserLearningPathTopic, Long> {
    List<UserLearningPathTopic> findByUserLearningPathIdOrderByLearningPathTopicOrderIndexAsc(Long userLearningPathId);
    Optional<UserLearningPathTopic> findByUserLearningPathIdAndLearningPathTopicId(Long userLearningPathId, Long learningPathTopicId);
}