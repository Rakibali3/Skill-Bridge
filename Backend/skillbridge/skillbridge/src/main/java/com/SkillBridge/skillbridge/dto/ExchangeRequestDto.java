package com.SkillBridge.skillbridge.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ExchangeRequestDto {

    @NotNull(message = "Receiver is required")
    private Long receiverId;
}
