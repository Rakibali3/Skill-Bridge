package com.SkillBridge.skillbridge.controller;

import com.SkillBridge.skillbridge.dto.CommunityCommentRequestDto;
import com.SkillBridge.skillbridge.dto.CommunityCommentResponseDto;
import com.SkillBridge.skillbridge.service.CommunityCommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(
        "/communities/{communityId}/posts/{postId}/comments"
)
@RequiredArgsConstructor
public class CommunityCommentController {

    private final CommunityCommentService commentService;

    @PostMapping
    public CommunityCommentResponseDto createComment(
            @PathVariable Long communityId,
            @PathVariable Long postId,
            @Valid @RequestBody CommunityCommentRequestDto request,
            Authentication authentication
    ) {

        return commentService.createComment(
                communityId,
                postId,
                request,
                authentication
        );
    }

    @GetMapping
    public List<CommunityCommentResponseDto> getComments(
            @PathVariable Long communityId,
            @PathVariable Long postId,
            Authentication authentication
    ) {


        return commentService.getComments(
                communityId,
                postId,
                authentication
        );
    }

    @PutMapping("/{commentId}")
    public CommunityCommentResponseDto updateComment(
            @PathVariable Long communityId,
            @PathVariable Long postId,
            @PathVariable Long commentId,
            @Valid @RequestBody CommunityCommentRequestDto request,
            Authentication authentication
    ) {


        return commentService.updateComment(
                communityId,
                postId,
                commentId,
                request,
                authentication
        );
    }

    @DeleteMapping("/{commentId}")
    public void deleteComment(
            @PathVariable Long communityId,
            @PathVariable Long postId,
            @PathVariable Long commentId,
            Authentication authentication
    ) {
        commentService.deleteComment(
                communityId,
                postId,
                commentId,
                authentication
        );
    }
}