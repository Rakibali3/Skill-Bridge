package com.SkillBridge.skillbridge.controller;

import com.SkillBridge.skillbridge.dto.MatchResponseDto;
import com.SkillBridge.skillbridge.service.MatchService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/matches")
public class MatchController {
    private final MatchService matchService;

    @GetMapping
    public List<MatchResponseDto> getMatches(Authentication authentication) {
        return matchService.getMatches(authentication);
    }
}
