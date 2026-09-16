package com.SkillBridge.skillbridge.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginResponseDto {
    private String userName;
    private String email;
    private String token;
}
