package com.SkillBridge.skillbridge.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class MatchResponseDto {
    private Long userId;

    private String userName;

    private String email;

    private String location;

    private String avatarUrl;

    private String experience;

    private String preferredFormat;

    private String availability;

    private Double matchScore;

    private List<String> canTeach;

    private List<String> wantsToLearn;
}
