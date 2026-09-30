package com.SkillBridge.skillbridge.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SearchSkillResponseDto {

    private Long id;
    private String name;
    private String category;
}