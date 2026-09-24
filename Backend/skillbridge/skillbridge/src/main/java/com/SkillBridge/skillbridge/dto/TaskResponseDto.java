package com.SkillBridge.skillbridge.dto;

import com.SkillBridge.skillbridge.enums.TaskStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class TaskResponseDto {

    private Long id;

    private Long exchangeId;

    private Long createdById;
    private String createdByName;

    private Long assignedToId;
    private String assignedToName;

    private String title;
    private String description;

    private TaskStatus status;

    private String githubUrl;
    private String submittedFileUrl;
    private String submittedFileName;

    private LocalDateTime createdAt;
    private LocalDateTime submittedAt;
    private LocalDateTime completedAt;
}