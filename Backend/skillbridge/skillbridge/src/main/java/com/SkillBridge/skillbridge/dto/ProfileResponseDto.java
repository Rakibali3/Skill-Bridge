package com.SkillBridge.skillbridge.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProfileResponseDto {
    private Long id;

    private String userName;

    private String email;

    private String bio;

    private String location;

    private String experience;

    private String learningStyle;

    private String preferredFormat;

    private String availability;

    private String avatarUrl;
}
