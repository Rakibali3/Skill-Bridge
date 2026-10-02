package com.SkillBridge.skillbridge.service;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import com.SkillBridge.skillbridge.ExceptionHandling.AuthenticatedUserNotFoundException;
import com.SkillBridge.skillbridge.dto.CommunityCommentRequestDto;
import com.SkillBridge.skillbridge.dto.CommunityCommentResponseDto;
import com.SkillBridge.skillbridge.entity.CommunityComment;
import com.SkillBridge.skillbridge.entity.CommunityPost;
import com.SkillBridge.skillbridge.entity.User;
import com.SkillBridge.skillbridge.repository.CommunityCommentRepository;
import com.SkillBridge.skillbridge.repository.CommunityMemberRepository;
import com.SkillBridge.skillbridge.repository.CommunityPostRepository;
import com.SkillBridge.skillbridge.repository.UserProfileRepository;
import com.SkillBridge.skillbridge.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommunityCommentService {

    private final CommunityCommentRepository commentRepository;
    private final CommunityPostRepository postRepository;
    private final CommunityMemberRepository memberRepository;
    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;

    @Transactional
    public CommunityCommentResponseDto createComment(
            Long communityId,
            Long postId,
            CommunityCommentRequestDto request,
           Authentication authentication
    ) {
        String email = authentication.getName();
        User currUser = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(()->new AuthenticatedUserNotFoundException("user not found"));
        Long userId = currUser.getId();

        validateMembership(communityId, userId);

        CommunityPost post = postRepository
                .findByIdAndCommunityId(postId, communityId)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found")
                );

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found")
                );

        String content = request.getContent().trim();

        if (content.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Comment cannot be empty");
        }

        CommunityComment comment = CommunityComment.builder()
                .post(post)
                .author(user)
                .content(content)
                .build();

        commentRepository.save(comment);

        return mapToResponse(comment);
    }

    @Transactional(readOnly = true)
    public List<CommunityCommentResponseDto> getComments(
            Long communityId,
            Long postId,
            Authentication authentication
    ) {
        String email = authentication.getName();
        User currUser = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(()->new AuthenticatedUserNotFoundException("user not found"));
        Long userId = currUser.getId();

        validateMembership(communityId, userId);

        postRepository
                .findByIdAndCommunityId(postId, communityId)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found")
                );

        return commentRepository
                .findByPostIdOrderByCreatedAtAsc(postId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional
    public CommunityCommentResponseDto updateComment(
            Long communityId,
            Long postId,
            Long commentId,
            CommunityCommentRequestDto request,
           Authentication authentication
    ) {
        String email = authentication.getName();
        User currUser = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(()->new AuthenticatedUserNotFoundException("user not found"));
        Long userId = currUser.getId();

        validateMembership(communityId, userId);

        CommunityComment comment =
                commentRepository
                        .findByIdAndPostId(
                                commentId,
                                postId
                        )
                        .orElseThrow(() ->
                                new ResponseStatusException(HttpStatus.NOT_FOUND, "Comment not found")
                        );

        if (!comment.getAuthor().getId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only edit your own comment");
        }

        String content = request.getContent().trim();

        if (content.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Comment cannot be empty");
        }

        comment.setContent(content);

        return mapToResponse(commentRepository.save(comment));
    }

    @Transactional
    public void deleteComment(
            Long communityId,
            Long postId,
            Long commentId,
            Authentication authentication
    ) {
        String email = authentication.getName();
        User currUser = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(()->new AuthenticatedUserNotFoundException("user not found"));
        Long userId = currUser.getId();

        validateMembership(communityId, userId);

        CommunityComment comment =
                commentRepository
                        .findByIdAndPostId(
                                commentId,
                                postId
                        )
                        .orElseThrow(() ->
                                new ResponseStatusException(HttpStatus.NOT_FOUND, "Comment not found")
                        );

        if (!comment.getAuthor().getId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only delete your own comment");
        }

        commentRepository.delete(comment);
    }

    private void validateMembership(
            Long communityId,
            Long userId
    ) {

        boolean member =
                memberRepository
                        .existsByCommunityIdAndUserId(
                                communityId,
                                userId
                        );

        if (!member) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You must be a community member");
        }
    }

    private CommunityCommentResponseDto mapToResponse(
            CommunityComment comment
    ) {

        String avatarUrl =
                userProfileRepository
                        .findByUserId(comment.getAuthor().getId())
                        .map(profile -> profile.getAvatarUrl())
                        .orElse(null);

        return CommunityCommentResponseDto.builder()
                .id(comment.getId())
                .postId(comment.getPost().getId())
                .authorId(comment.getAuthor().getId())
                .authorName(comment.getAuthor().getUserName())
                .authorAvatarUrl(avatarUrl)
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }
}