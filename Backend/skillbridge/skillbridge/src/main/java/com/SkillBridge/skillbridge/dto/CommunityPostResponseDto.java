package com.SkillBridge.skillbridge.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class CommunityPostResponseDto {
    private Long id;
    private Long communityId;
    private Long authorId;
    private String authorName;
    private String authorAvatarUrl;
    private String content;
    private Long commentsCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
