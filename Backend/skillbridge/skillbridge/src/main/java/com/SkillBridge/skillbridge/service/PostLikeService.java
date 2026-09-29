package com.SkillBridge.skillbridge.service;

import com.SkillBridge.skillbridge.ExceptionHandling.AuthenticatedUserNotFoundException;
import com.SkillBridge.skillbridge.dto.PostLikeResponseDto;
import com.SkillBridge.skillbridge.entity.CommunityPost;
import com.SkillBridge.skillbridge.entity.PostLike;
import com.SkillBridge.skillbridge.entity.User;
import com.SkillBridge.skillbridge.repository.CommunityMemberRepository;
import com.SkillBridge.skillbridge.repository.CommunityPostRepository;
import com.SkillBridge.skillbridge.repository.PostLikeRepository;
import com.SkillBridge.skillbridge.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PostLikeService {

    private final PostLikeRepository postLikeRepository;
    private final CommunityPostRepository communityPostRepository;
    private final CommunityMemberRepository communityMemberRepository;
    private final UserRepository userRepository;

    @Transactional
    public PostLikeResponseDto likePost(
            Long communityId,
            Long postId,
            Authentication authentication
    ) {
        String email = authentication.getName();
        User currUser = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(()->new AuthenticatedUserNotFoundException("user not found"));
        Long userId = currUser.getId();
        validateMembership(communityId, userId);

        CommunityPost post = communityPostRepository
                .findByIdAndCommunityId(postId, communityId)
                .orElseThrow(() ->
                        new RuntimeException("Post not found")
                );

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        boolean alreadyLiked =
                postLikeRepository.existsByPostIdAndUserId(postId, userId);

        if (!alreadyLiked) {

            PostLike postLike = PostLike.builder()
                    .post(post)
                    .user(user)
                    .build();

            postLikeRepository.save(postLike);
        }

        return buildResponse(postId, userId);
    }

    @Transactional
    public PostLikeResponseDto unlikePost(
            Long communityId,
            Long postId,
            Authentication authentication
    ) {
        String email = authentication.getName();
        User currUser = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(()->new AuthenticatedUserNotFoundException("user not found"));
        Long userId = currUser.getId();
        validateMembership(communityId, userId);

        communityPostRepository
                .findByIdAndCommunityId(postId, communityId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        postLikeRepository.deleteByPostIdAndUserId(
                postId,
                userId
        );

        return buildResponse(postId, userId);
    }

    @Transactional(readOnly = true)
    public PostLikeResponseDto getLikeStatus(
            Long communityId,
            Long postId,
           Authentication authentication
    ) {
        String email = authentication.getName();
        User currUser = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(()->new AuthenticatedUserNotFoundException("user not found"));
        Long userId = currUser.getId();
        validateMembership(communityId, userId);

        communityPostRepository
                .findByIdAndCommunityId(postId, communityId)
                .orElseThrow(() ->
                        new RuntimeException("Post not found")
                );

        return buildResponse(postId, userId);
    }

    private void validateMembership(
            Long communityId,
            Long userId
    ) {

        boolean member =
                communityMemberRepository
                        .existsByCommunityIdAndUserId(
                                communityId,
                                userId
                        );

        if (!member) {
            throw new RuntimeException(
                    "You must be a community member"
            );
        }
    }

    private PostLikeResponseDto buildResponse(
            Long postId,
            Long userId
    ) {

        long likeCount =
                postLikeRepository.countByPostId(postId);

        boolean liked =
                postLikeRepository.existsByPostIdAndUserId(
                        postId,
                        userId
                );

        return PostLikeResponseDto.builder()
                .postId(postId)
                .likeCount(likeCount)
                .likedByCurrentUser(liked)
                .build();
    }
}