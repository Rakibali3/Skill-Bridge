package com.SkillBridge.skillbridge.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AdminSkillRequestDto {
    @NotBlank(message = "Skill name is required")
    @Size(
            max = 100,
            message = "Skill name cannot exceed 100 characters"
    )
    private String name;

    @NotBlank(message = "Category is required")
    @Size(
            max = 100,
            message = "Category cannot exceed 100 characters"
    )
    private String category;
}
