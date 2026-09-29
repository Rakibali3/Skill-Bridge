package com.SkillBridge.skillbridge.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CommunityCommentRequestDto {

    @NotBlank(message = "Comment cannot be empty")
    @Size(
            max = 2000,
            message = "Comment cannot exceed 2000 characters"
    )
    private String content;
}