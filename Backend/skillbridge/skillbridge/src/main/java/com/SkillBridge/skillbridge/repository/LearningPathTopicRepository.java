package com.SkillBridge.skillbridge.repository;

import com.SkillBridge.skillbridge.entity.LearningPathTopic;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LearningPathTopicRepository
        extends JpaRepository<LearningPathTopic, Long> {

    List<LearningPathTopic>
    findByLearningPathIdAndActiveTrueOrderByOrderIndexAsc(
            Long learningPathId
    );

    List<LearningPathTopic>
    findByLearningPathIdOrderByOrderIndexAsc(
            Long learningPathId
    );
}