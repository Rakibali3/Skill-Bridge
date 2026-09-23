package com.SkillBridge.skillbridge.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ExchangeCreateRequestDto {

    @NotNull(message = "Partner ID is required")
    private Long partnerId;

    @NotNull(message = "Your teaching skill is required")
    private Long myTeachingSkillId;

    @NotNull(message = "Your learning skill is required")
    private Long myLearningSkillId;

    @NotNull(message = "Partner teaching skill is required")
    private Long partnerTeachingSkillId;

    @NotNull(message = "Partner learning skill is required")
    private Long partnerLearningSkillId;
}