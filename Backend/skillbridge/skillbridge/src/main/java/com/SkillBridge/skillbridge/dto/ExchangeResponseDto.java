package com.SkillBridge.skillbridge.dto;

import com.SkillBridge.skillbridge.enums.ExchangeStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class ExchangeResponseDto {

    private Long id;

    private Long user1Id;
    private String user1Name;

    private Long user2Id;
    private String user2Name;

    private String user1AvatarUrl;
    private String user2AvatarUrl;

    private ExchangeStatus status;

    private LocalDateTime createdAt;

    private boolean user1CompletionConfirmed;
    private boolean user2CompletionConfirmed;
    private LocalDateTime completedAt;

    private List<ExchangeSkillResponseDto> skills;
}