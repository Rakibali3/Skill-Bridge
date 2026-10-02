package com.SkillBridge.skillbridge.service;

import com.SkillBridge.skillbridge.ExceptionHandling.AuthenticatedUserNotFoundException;
import com.SkillBridge.skillbridge.dto.CommunityPostRequestDto;
import com.SkillBridge.skillbridge.dto.CommunityPostResponseDto;
import com.SkillBridge.skillbridge.entity.Community;
import com.SkillBridge.skillbridge.entity.CommunityPost;
import com.SkillBridge.skillbridge.entity.User;
import com.SkillBridge.skillbridge.entity.UserProfile;
import com.SkillBridge.skillbridge.repository.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommunityPostService {
    private final UserRepository userRepository;
    private final CommunityRepository communityRepository;
    private final CommunityPostRepository communityPostRepository;
    private final CommunityMemberRepository communityMemberRepository;
    private final UserProfileRepository userProfileRepository;
    private final CommunityCommentRepository commentRepository;

    @Transactional
    public CommunityPostResponseDto createPost(Authentication authentication, Long communityId, @Valid CommunityPostRequestDto request) {
        User user = getAuthentication(authentication);
        Community community = getCommunity(communityId);
        verifyMember(user.getId(),communityId);
        String content = request.getContent().trim();

        if (content.isEmpty()) {
            throw new IllegalArgumentException("Post content cannot be empty");
        }

        CommunityPost post = CommunityPost.builder()
                .community(community)
                .author(user)
                .content(content)
                .build();

        CommunityPost savedPost = communityPostRepository.save(post);

        return mapToResponse(savedPost);
    }

    @Transactional(readOnly = true)
    public Page<CommunityPostResponseDto> getPosts(
            Authentication authentication,
            Long communityId,
            int page,
            int size
    ) {
        User user = getAuthentication(authentication);

        getCommunity(communityId);

        verifyMember(user.getId(), communityId);

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(Sort.Direction.DESC, "createdAt")
        );

        return communityPostRepository
                .findByCommunityIdOrderByCreatedAtDesc(
                        communityId,
                        pageable
                )
                .map(this::mapToResponse);
    }

    @Transactional
    public CommunityPostResponseDto updatePost(Authentication authentication, Long communityId, Long postId, @Valid CommunityPostRequestDto request) {
        User user = getAuthentication(authentication);
        getCommunity(communityId);
        verifyMember(user.getId(),communityId);
        CommunityPost post = communityPostRepository.findByIdAndCommunityId(postId, communityId).orElse(null);
        if (post == null) {
            throw new RuntimeException("post is not available");
        }
        if (!post.getAuthor().getId().equals(user.getId())) {
            throw new RuntimeException("You can only edit your own posts");
        }

        String content = request.getContent().trim();
        if (content.isEmpty()) {
            throw new IllegalArgumentException("Post content cannot be empty");
        }

        post.setContent(content);
        CommunityPost updatedPost = communityPostRepository.save(post);

        return mapToResponse(updatedPost);
    }

    public void deletePost(Authentication authentication, Long communityId, Long postId) {
        User user = getAuthentication(authentication);
        getCommunity(communityId);
        verifyMember(user.getId(),communityId);
        CommunityPost post = communityPostRepository.findByIdAndCommunityId(postId, communityId).orElse(null);
        if (post == null) {
            throw new RuntimeException("post is not available");
        }
        if (!post.getAuthor().getId().equals(user.getId())) {
            throw new RuntimeException("only authors of the post can delete it");
        }
        communityPostRepository.deleteById(postId);
    }

    private CommunityPostResponseDto mapToResponse(CommunityPost post) {
        String avatarUrl = null;

        UserProfile profile = userProfileRepository.findByUserId(post.getAuthor().getId()).orElse(null);

        if (profile != null) {
            avatarUrl = profile.getAvatarUrl();
        }
        return CommunityPostResponseDto.builder()
                .id(post.getId())
                .communityId(post.getCommunity().getId())
                .authorId(post.getAuthor().getId())
                .authorName(post.getAuthor().getUserName())
                .authorAvatarUrl(avatarUrl)
                .content(post.getContent())
                .commentsCount(commentRepository.countByPostId(post.getId()))
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }

    private void verifyMember(Long id, Long communityId) {
        boolean isMember = communityMemberRepository.existsByCommunityIdAndUserId(communityId, id);
        if (!isMember) {
            throw new RuntimeException("You must be a community member");
        }
    }

    private Community getCommunity(Long communityId) {
        return communityRepository.findByIdAndActiveTrue(communityId)
                .orElseThrow(()->new RuntimeException("community not found"));
    }

    private User getAuthentication(Authentication authentication) {
        String email = authentication.getName();
        return userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(()->new AuthenticatedUserNotFoundException("Authenticated user not found"));
    }
}
