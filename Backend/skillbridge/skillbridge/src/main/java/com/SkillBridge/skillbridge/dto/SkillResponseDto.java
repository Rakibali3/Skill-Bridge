package com.SkillBridge.skillbridge.dto;

import com.SkillBridge.skillbridge.enums.SkillLevel;
import com.SkillBridge.skillbridge.enums.SkillType;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SkillResponseDto {
    private Long id;

    private Long skillId;

    private String skillName;

    private String category;

    private SkillType skillType;

    private SkillLevel level;

    private String experience;

    private String description;

    private String learningGoal;
}
