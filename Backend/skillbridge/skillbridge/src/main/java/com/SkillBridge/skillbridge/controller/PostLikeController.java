package com.SkillBridge.skillbridge.controller;

import com.SkillBridge.skillbridge.dto.PostLikeResponseDto;
import com.SkillBridge.skillbridge.service.PostLikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/communities/{communityId}/posts/{postId}")
@RequiredArgsConstructor
public class PostLikeController {

    private final PostLikeService postLikeService;

    @PostMapping("/like")
    public PostLikeResponseDto likePost(
            @PathVariable Long communityId,
            @PathVariable Long postId,
            Authentication authentication
    ) {

        return postLikeService.likePost(
                communityId,
                postId,
                authentication
        );
    }

    @DeleteMapping("/like")
    public PostLikeResponseDto unlikePost(
            @PathVariable Long communityId,
            @PathVariable Long postId,
            Authentication authentication
    ) {

        return postLikeService.unlikePost(
                communityId,
                postId,
                authentication
        );
    }

    @GetMapping("/like")
    public PostLikeResponseDto getLikeStatus(
            @PathVariable Long communityId,
            @PathVariable Long postId,
            Authentication authentication
    ) {

        return postLikeService.getLikeStatus(
                communityId,
                postId,
                authentication
        );
    }
}