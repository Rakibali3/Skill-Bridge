package com.SkillBridge.skillbridge.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class LearningPathRequestDto {

    @NotNull(message = "Skill is required")
    private Long skillId;

    @NotBlank(message = "Path title is required")
    @Size(
            min = 3,
            max = 150,
            message = "Path title must be between 3 and 150 characters"
    )
    private String title;

    @Size(
            max = 1000,
            message = "Description cannot exceed 1000 characters"
    )
    private String description;
}