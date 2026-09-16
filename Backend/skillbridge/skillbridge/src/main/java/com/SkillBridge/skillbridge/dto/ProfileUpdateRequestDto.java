package com.SkillBridge.skillbridge.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ProfileUpdateRequestDto {
    @Size(
            max = 500,
            message = "Bio cannot exceed 500 characters"
    )
    private String bio;

    @Size(
            max = 100,
            message = "Location cannot exceed 100 characters"
    )
    private String location;

    @Size(
            max = 50,
            message = "Experience cannot exceed 50 characters"
    )
    private String experience;

    @Size(
            max = 50,
            message = "Learning style cannot exceed 50 characters"
    )
    private String learningStyle;

    @Size(
            max = 100,
            message = "Preferred format cannot exceed 100 characters"
    )
    private String preferredFormat;

    @Size(
            max = 100,
            message = "Availability cannot exceed 100 characters"
    )
    private String availability;

    @Size(
            max = 500,
            message = "Avatar URL cannot exceed 500 characters"
    )
    private String avatarUrl;
}
