package com.SkillBridge.skillbridge.dto;

import com.SkillBridge.skillbridge.enums.Roles;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ProfileResponseDto {

    /*
     * This is USER ID.
     */
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

    private Roles role;

    private List<ProfileSkillResponseDto> skills;
}