package com.SkillBridge.skillbridge.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CommunityCreateRequestDto {

    @NotBlank(message = "Community name is required")
    @Size(
            min = 3,
            max = 100,
            message = "Community name must be between 3 and 100 characters"
    )
    private String name;

    @Size(
            max = 1000,
            message = "Description cannot exceed 1000 characters"
    )
    private String description;

    @Size(
            max = 100,
            message = "Category cannot exceed 100 characters"
    )
    private String category;

    @Size(
            max = 500,
            message = "Cover image URL cannot exceed 500 characters"
    )
    private String coverImageUrl;

    @Size(
            max = 500,
            message = "Icon URL cannot exceed 500 characters"
    )
    private String iconUrl;
}