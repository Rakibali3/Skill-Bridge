package com.SkillBridge.skillbridge.controller;

import com.SkillBridge.skillbridge.dto.CommunityPostRequestDto;
import com.SkillBridge.skillbridge.dto.CommunityPostResponseDto;
import com.SkillBridge.skillbridge.service.CommunityPostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/communities/{communityId}/posts")
public class CommunityPostController {

    private final CommunityPostService communityPostService;

    @PostMapping
    public ResponseEntity<CommunityPostResponseDto> createPost(
            Authentication authentication,
            @PathVariable Long communityId,
            @Valid @RequestBody CommunityPostRequestDto request
    ) {
        return ResponseEntity.ok(communityPostService
                .createPost(authentication, communityId, request));
    }


    @GetMapping
    public ResponseEntity<Page<CommunityPostResponseDto>> getPosts(
            Authentication authentication,
            @PathVariable Long communityId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {

        return ResponseEntity.ok(
                communityPostService.getPosts(
                        authentication,
                        communityId,
                        page,
                        size
                )
        );
    }

    @PutMapping("/{postId}")
    public ResponseEntity<CommunityPostResponseDto> updatePost(
            Authentication authentication,
            @PathVariable Long communityId,
            @PathVariable Long postId,
            @Valid @RequestBody CommunityPostRequestDto request
    ) {

        return ResponseEntity.ok(
                communityPostService.updatePost(
                        authentication,
                        communityId,
                        postId,
                        request
                )
        );
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> deletePost(
            Authentication authentication,
            @PathVariable Long communityId,
            @PathVariable Long postId
    ) {

        communityPostService.deletePost(
                authentication,
                communityId,
                postId
        );

        return ResponseEntity.noContent().build();
    }
}