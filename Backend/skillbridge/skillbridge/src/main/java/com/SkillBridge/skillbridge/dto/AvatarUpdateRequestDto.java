package com.SkillBridge.skillbridge.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AvatarUpdateRequestDto {
    @NotBlank(message = "Avatar URL is required")
    private String avatarUrl;
}
