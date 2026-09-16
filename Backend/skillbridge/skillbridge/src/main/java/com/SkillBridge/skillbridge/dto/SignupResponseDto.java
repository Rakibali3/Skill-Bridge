package com.SkillBridge.skillbridge.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SignupResponseDto {
    private String message;

    private Long id;

    private String userName;

    private String email;
}
