package com.SkillBridge.skillbridge.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LearningPathTopicProgressResponseDto {

    private Long topicId;

    private String title;

    private String description;

    private Integer orderIndex;

    private String resourceUrl;

    private String status;

    private Integer progress;

    private boolean active;
}