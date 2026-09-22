package com.SkillBridge.skillbridge.dto;

import com.SkillBridge.skillbridge.enums.ExchangeRequestStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ExchangeRequestResponseDto {

    private Long id;

    private Long senderId;
    private String senderName;

    private Long receiverId;
    private String receiverName;

    private ExchangeRequestStatus status;

    private LocalDateTime createdAt;
}