package com.SkillBridge.skillbridge.dto;

import com.SkillBridge.skillbridge.enums.SkillType;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProfileSkillResponseDto {

    private Long userSkillId;

    private Long skillId;

    private String skillName;

    private String category;

    private SkillType skillType;
}