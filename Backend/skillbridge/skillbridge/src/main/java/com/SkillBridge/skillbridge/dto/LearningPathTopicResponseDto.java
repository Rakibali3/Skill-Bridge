package com.SkillBridge.skillbridge.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LearningPathTopicResponseDto {

    private Long id;

    private Long learningPathId;

    private String title;

    private String description;

    private Integer orderIndex;

    private String resourceUrl;

    private boolean active;
}