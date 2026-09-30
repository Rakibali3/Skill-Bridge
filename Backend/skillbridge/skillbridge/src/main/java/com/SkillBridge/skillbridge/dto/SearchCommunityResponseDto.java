package com.SkillBridge.skillbridge.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SearchCommunityResponseDto {

    private Long id;
    private String name;
    private String description;
    private String iconUrl;
    private long memberCount;
}