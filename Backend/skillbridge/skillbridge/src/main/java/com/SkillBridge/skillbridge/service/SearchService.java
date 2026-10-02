package com.SkillBridge.skillbridge.service;

import com.SkillBridge.skillbridge.dto.*;
import com.SkillBridge.skillbridge.entity.Community;
import com.SkillBridge.skillbridge.entity.Skill;
import com.SkillBridge.skillbridge.entity.User;
import com.SkillBridge.skillbridge.entity.UserProfile;
import com.SkillBridge.skillbridge.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SearchService {

    private final UserRepository userRepository;
    private final SkillRepository skillRepository;
    private final CommunityRepository communityRepository;
    private final CommunityMemberRepository communityMemberRepository;
    private final UserProfileRepository userProfileRepository;

    @Transactional(readOnly = true)
    public GlobalSearchResponseDto search(String query) {

        String searchQuery = query.trim();

        if (searchQuery.isEmpty()) {
            return GlobalSearchResponseDto.builder()
                    .users(List.of())
                    .skills(List.of())
                    .communities(List.of())
                    .build();
        }

        List<SearchUserResponseDto> users = userRepository
                        .findTop5ByUserNameContainingIgnoreCase(searchQuery)
                        .stream()
                        .map(this::mapUser)
                        .toList();

        List<SearchSkillResponseDto> skills = skillRepository
                        .findTop5ByNameContainingIgnoreCase(searchQuery)
                        .stream()
                        .map(this::mapSkill)
                        .toList();

        List<SearchCommunityResponseDto> communities = communityRepository
                        .findTop5ByNameContainingIgnoreCaseAndActiveTrue(searchQuery)
                        .stream()
                        .map(this::mapCommunity)
                        .toList();

        return GlobalSearchResponseDto.builder()
                .users(users)
                .skills(skills)
                .communities(communities)
                .build();
    }

    private SearchUserResponseDto mapUser(User user) {

        return SearchUserResponseDto.builder()
                .id(user.getId())
                .name(user.getUserName())
                .avatarUrl(getAvatarUrl(user.getId()))
                .build();
    }


    private SearchSkillResponseDto mapSkill(Skill skill) {

        return SearchSkillResponseDto.builder()
                .id(skill.getId())
                .name(skill.getName())
                .category(skill.getCategory())
                .build();
    }

    private SearchCommunityResponseDto mapCommunity(
            Community community
    ) {

        return SearchCommunityResponseDto.builder()
                .id(community.getId())
                .name(community.getName())
                .description(community.getDescription())
                .iconUrl(community.getIconUrl())
                .memberCount(
                        communityMemberRepository
                                .countByCommunityId(community.getId())
                )
                .build();
    }
    private String getAvatarUrl(Long id) {
        UserProfile userProfile = userProfileRepository.findByUserId(id).orElse(null);
        if (userProfile == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "user not found");
        }
        return  userProfile.getAvatarUrl();
    }
}