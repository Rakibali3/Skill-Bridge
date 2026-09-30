package com.SkillBridge.skillbridge.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class LearningPathResponseDto {

    private Long id;

    private Long skillId;

    private String skillName;

    private String title;

    private String description;

    private boolean active;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}