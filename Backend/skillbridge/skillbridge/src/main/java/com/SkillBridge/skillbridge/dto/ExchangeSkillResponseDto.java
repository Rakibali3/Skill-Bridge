package com.SkillBridge.skillbridge.dto;

import com.SkillBridge.skillbridge.enums.ExchangeSkillDirection;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ExchangeSkillResponseDto {

    private Long userId;
    private Long skillId;
    private String skillName;
    private ExchangeSkillDirection direction;
}