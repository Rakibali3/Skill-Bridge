package com.SkillBridge.skillbridge.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LearningPathListResponseDto {

    private Long id;

    private Long skillId;

    private String skillName;

    private String title;

    private String description;

    private Integer topicCount;

    private boolean started;

    private String status;

    private Integer progress;
}