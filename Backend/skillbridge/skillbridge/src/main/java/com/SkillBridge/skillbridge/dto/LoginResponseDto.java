package com.SkillBridge.skillbridge.dto;

import com.SkillBridge.skillbridge.enums.Roles;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginResponseDto {
    private String userName;
    private String email;
    private Roles role;
}
