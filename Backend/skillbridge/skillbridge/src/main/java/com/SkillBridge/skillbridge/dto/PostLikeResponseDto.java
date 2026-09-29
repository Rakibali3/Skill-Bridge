package com.SkillBridge.skillbridge.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PostLikeResponseDto {

    private Long postId;

    private long likeCount;

    private boolean likedByCurrentUser;
}