package com.SkillBridge.skillbridge.controller;

import com.SkillBridge.skillbridge.dto.ProfileResponseDto;
import com.SkillBridge.skillbridge.dto.ProfileUpdateRequestDto;
import com.SkillBridge.skillbridge.service.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/profile")
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping
    public ResponseEntity<ProfileResponseDto> getMyProfile(Authentication authentication){
       return ResponseEntity.ok(profileService.getProfile(authentication));
    }

    @PostMapping
    public ResponseEntity<ProfileResponseDto> updateMyProfile(Authentication authentication,
            @Valid @RequestBody ProfileUpdateRequestDto request)
    {
         return ResponseEntity.ok(profileService.updateProfile(authentication, request));
    }
}
