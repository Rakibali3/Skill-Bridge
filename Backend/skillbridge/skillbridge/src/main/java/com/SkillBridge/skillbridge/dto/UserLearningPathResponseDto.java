package com.SkillBridge.skillbridge.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class UserLearningPathResponseDto {

    private Long id;

    private Long learningPathId;

    private String skillName;

    private String title;

    private String description;

    private String status;

    private Integer progress;

    private List<LearningPathTopicProgressResponseDto> topics;
}