package com.SkillBridge.skillbridge.dto;

import com.SkillBridge.skillbridge.enums.SkillLevel;
import com.SkillBridge.skillbridge.enums.SkillType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SkillRequestDto {
    @NotBlank(message = "Skill name is required")
    @Size(
            max = 100,
            message = "Skill name cannot exceed 100 characters"
    )
    private String skillName;

    @NotNull(message = "Skill type is required")
    private SkillType skillType;

    @NotNull(message = "Skill level is required")
    private SkillLevel level;

    @Size(
            max = 50,
            message = "Experience cannot exceed 50 characters"
    )
    private String experience;

    @Size(
            max = 500,
            message = "Description cannot exceed 500 characters"
    )
    private String description;

    @Size(
            max = 500,
            message = "Learning goal cannot exceed 500 characters"
    )
    private String learningGoal;
}
