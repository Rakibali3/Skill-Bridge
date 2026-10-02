package com.SkillBridge.skillbridge.dto;

import com.SkillBridge.skillbridge.enums.NotificationType;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class NotificationResponseDto {

    private Long id;
    private NotificationType type;
    private String title;
    private String message;
    private String link;
    private boolean read;
    private LocalDateTime createdAt;
}
