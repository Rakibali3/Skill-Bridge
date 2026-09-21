package com.SkillBridge.skillbridge.controller;

import com.SkillBridge.skillbridge.dto.AvatarUpdateRequestDto;
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

    @PutMapping
    public ResponseEntity<ProfileResponseDto> updateMyProfile(Authentication authentication,
            @Valid @RequestBody ProfileUpdateRequestDto request)
    {
         return ResponseEntity.ok(profileService.updateProfile(authentication, request));
    }

    @PutMapping("/avatar")
    public ResponseEntity<ProfileResponseDto> updateAvatar(Authentication authentication,
            @Valid @RequestBody AvatarUpdateRequestDto request) {

        return ResponseEntity.ok(profileService.updateAvatar(authentication, request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProfileResponseDto> getUserById(Authentication authentication, @PathVariable Long id){
        ProfileResponseDto profileResponseDto = profileService.getUserById(authentication,id);
        return ResponseEntity.ok(profileResponseDto);
    }
}