package com.SkillBridge.skillbridge.dto;

import com.SkillBridge.skillbridge.enums.ChatMessageStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ChatMessageResponseDto {

    private Long id;

    private Long exchangeId;

    private Long senderId;

    private String senderName;

    private String message;

    private ChatMessageStatus status;

    private LocalDateTime createdAt;
}