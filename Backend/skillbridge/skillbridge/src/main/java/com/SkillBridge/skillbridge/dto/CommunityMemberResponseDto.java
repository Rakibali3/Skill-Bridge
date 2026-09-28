package com.SkillBridge.skillbridge.dto;

import com.SkillBridge.skillbridge.enums.CommunityMemberRole;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class CommunityMemberResponseDto {

    private Long userId;
    private String userName;
    private String avatarUrl;
    private CommunityMemberRole role;
    private LocalDateTime joinedAt;
}