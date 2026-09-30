package com.SkillBridge.skillbridge.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class LearningPathTopicRequestDto {

    @NotBlank(message = "Topic title is required")
    @Size(
            min = 2,
            max = 200,
            message = "Topic title must be between 2 and 200 characters"
    )
    private String title;

    @Size(
            max = 1000,
            message = "Description cannot exceed 1000 characters"
    )
    private String description;

    @Min(
            value = 1,
            message = "Order index must be at least 1"
    )
    private Integer orderIndex;

    @Size(
            max = 500,
            message = "Resource URL cannot exceed 500 characters"
    )
    private String resourceUrl;
}