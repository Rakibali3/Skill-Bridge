package com.SkillBridge.skillbridge.controller;

import com.SkillBridge.skillbridge.dto.CommunityCreateRequestDto;
import com.SkillBridge.skillbridge.dto.CommunityMemberResponseDto;
import com.SkillBridge.skillbridge.dto.CommunityResponseDto;
import com.SkillBridge.skillbridge.service.CommunityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/communities")
public class CommunityController {

    private final CommunityService communityService;


    @PostMapping
    public ResponseEntity<CommunityResponseDto> createCommunity(
            Authentication authentication,
            @Valid @RequestBody CommunityCreateRequestDto request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(communityService.createCommunity(authentication, request));
    }


    @GetMapping
    public ResponseEntity<List<CommunityResponseDto>> getCommunities(
            Authentication authentication
    ) {

        return ResponseEntity.ok(communityService.getCommunities(authentication));
    }


    @GetMapping("/{communityId}")
    public ResponseEntity<CommunityResponseDto> getCommunity(
            Authentication authentication,
            @PathVariable Long communityId
    ) {
        return ResponseEntity.ok(communityService.getCommunity(authentication, communityId));
    }


    @PutMapping("/{communityId}")
    public ResponseEntity<CommunityResponseDto> updateCommunity(
            Authentication authentication,
            @PathVariable Long communityId,
            @Valid @RequestBody CommunityCreateRequestDto request
    ) {

        return ResponseEntity.ok(
                communityService.updateCommunity(
                        authentication,
                        communityId,
                        request
                )
        );
    }


    @DeleteMapping("/{communityId}")
    public ResponseEntity<Void> deleteCommunity(
            Authentication authentication,
            @PathVariable Long communityId
    ) {

        communityService.deleteCommunity(
                authentication,
                communityId
        );

        return ResponseEntity.noContent().build();
    }


    @PostMapping("/{communityId}/join")
    public ResponseEntity<CommunityResponseDto> joinCommunity(
            Authentication authentication,
            @PathVariable Long communityId
    ) {

        return ResponseEntity.ok(
                communityService.joinCommunity(
                        authentication,
                        communityId
                )
        );
    }


    @DeleteMapping("/{communityId}/leave")
    public ResponseEntity<Void> leaveCommunity(
            Authentication authentication,
            @PathVariable Long communityId
    ) {

        communityService.leaveCommunity(
                authentication,
                communityId
        );

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{communityId}/members")
    public ResponseEntity<List<CommunityMemberResponseDto>> getMembers(
            Authentication authentication,
            @PathVariable Long communityId
    ) {

        return ResponseEntity.ok(
                communityService.getMembers(
                        authentication,
                        communityId
                )
        );
    }
}