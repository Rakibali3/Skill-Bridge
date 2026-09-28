package com.SkillBridge.skillbridge.dto;

import com.SkillBridge.skillbridge.enums.CommunityMemberRole;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class CommunityResponseDto {

    private Long id;

    private String name;

    private String description;

    private String category;

    private String coverImageUrl;

    private String iconUrl;

    private Long createdById;

    private String createdByName;

    private long memberCount;

    private boolean joined;

    private CommunityMemberRole currentUserRole;

    private LocalDateTime createdAt;
}