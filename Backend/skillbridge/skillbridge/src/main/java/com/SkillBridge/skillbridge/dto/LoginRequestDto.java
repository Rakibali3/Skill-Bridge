package com.SkillBridge.skillbridge.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class LoginRequestDto {
    @NotBlank(message = "Email is required")
    @Email(message = "Please enter a valid email address")
    private String email;


    @NotBlank(message = "Password is required")
    @Size(
            min = 1,
            max = 100,
            message = "Password must be between 1 and 100 characters"
    )
    private String password;

    private boolean rememberMe;
}
