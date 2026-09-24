package com.SkillBridge.skillbridge.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class TaskCreateRequestDto {

    @NotNull(message = "Exchange ID is required")
    private Long exchangeId;

    @NotNull(message = "Assigned user ID is required")
    private Long assignedToId;

    @NotBlank(message = "Task title is required")
    @Size(max = 150, message = "Task title cannot exceed 150 characters")
    private String title;

    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    private String description;
}