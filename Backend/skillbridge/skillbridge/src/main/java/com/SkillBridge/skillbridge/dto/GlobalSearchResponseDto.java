package com.SkillBridge.skillbridge.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class GlobalSearchResponseDto {

    private List<SearchUserResponseDto> users;
    private List<SearchSkillResponseDto> skills;
    private List<SearchCommunityResponseDto> communities;
}