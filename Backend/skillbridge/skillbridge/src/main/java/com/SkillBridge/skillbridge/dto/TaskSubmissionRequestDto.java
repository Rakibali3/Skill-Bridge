package com.SkillBridge.skillbridge.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class TaskSubmissionRequestDto {

    @Size(
            max = 500,
            message = "GitHub URL cannot exceed 500 characters"
    )
    private String githubUrl;

    @Size(
            max = 500,
            message = "File URL cannot exceed 500 characters"
    )
    private String submittedFileUrl;

    @Size(
            max = 255,
            message = "File name cannot exceed 255 characters"
    )
    private String submittedFileName;
}