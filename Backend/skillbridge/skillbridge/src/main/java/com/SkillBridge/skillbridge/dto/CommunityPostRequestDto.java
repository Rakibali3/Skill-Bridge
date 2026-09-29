package com.SkillBridge.skillbridge.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CommunityPostRequestDto {
    @NotBlank(message = "Post content is required")
    @Size(
            max = 5000,
            message = "Post content cannot exceed 5000 characters"
    )
    private String content;
}
