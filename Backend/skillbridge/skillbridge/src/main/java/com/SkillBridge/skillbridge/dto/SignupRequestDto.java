package com.SkillBridge.skillbridge.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import lombok.Data;

@Data
public class SignupRequestDto {

    @NotBlank(message = "Username is required")

    @Size(
            min = 2,
            max = 50,
            message = "Username must be between 2 and 50 characters"
    )
    private String userName;

    @NotBlank(message = "Email is required")

    @Size(
            max = 254,
            message = "Email address is too long"
    )

    @Email(
            message = "Please enter a valid email address"
    )
    @Pattern(
            regexp = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+\\.[A-Za-z]{2,}$",
            message = "Please enter a valid email address"
    )
    private String email;

    @NotBlank(message = "Password is required")

    @Size(
            min = 8,
            max = 100,
            message = "Password must be between 8 and 100 characters"
    )

    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).+$",
            message = "Password must contain uppercase, lowercase, number, and special character"
    )
    private String password;
}