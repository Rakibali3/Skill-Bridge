package com.SkillBridge.skillbridge.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class CommunityCommentResponseDto {

    private Long id;

    private Long postId;

    private Long authorId;

    private String authorName;

    private String authorAvatarUrl;

    private String content;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}