package com.SkillBridge.skillbridge.service;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import com.SkillBridge.skillbridge.ExceptionHandling.AuthenticatedUserNotFoundException;
import com.SkillBridge.skillbridge.dto.CommunityCreateRequestDto;
import com.SkillBridge.skillbridge.dto.CommunityMemberResponseDto;
import com.SkillBridge.skillbridge.dto.CommunityResponseDto;
import com.SkillBridge.skillbridge.entity.Community;
import com.SkillBridge.skillbridge.entity.CommunityMember;
import com.SkillBridge.skillbridge.entity.User;
import com.SkillBridge.skillbridge.entity.UserProfile;
import com.SkillBridge.skillbridge.enums.CommunityMemberRole;
import com.SkillBridge.skillbridge.repository.CommunityMemberRepository;
import com.SkillBridge.skillbridge.repository.CommunityRepository;
import com.SkillBridge.skillbridge.repository.UserProfileRepository;
import com.SkillBridge.skillbridge.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommunityService {
    private final UserRepository userRepository;
    private final CommunityRepository communityRepository;
    private final CommunityMemberRepository communityMemberRepository;
    private final UserProfileRepository userProfileRepository;

    public CommunityResponseDto createCommunity(Authentication authentication, @Valid CommunityCreateRequestDto requestDto) {
        User user = getAuthenticatedUser(authentication);
        String name = requestDto.getName().trim();
        if(communityRepository.existsByNameIgnoreCase(name)){
            throw new ResponseStatusException(HttpStatus.CONFLICT, "A community with this name already exists");
        }
        Community community = Community.builder()
                .name(name)
                .description(clean(requestDto.getDescription()))
                .category(clean(requestDto.getCategory()))
                .coverImageUrl(clean(requestDto.getCoverImageUrl()))
                .iconUrl(clean(requestDto.getIconUrl()))
                .createdBy(user)
                .build();

        Community savedCommunity = communityRepository.save(community);

        CommunityMember owner = CommunityMember.builder()
                .community(savedCommunity)
                .user(user)
                .role(CommunityMemberRole.OWNER)
                .build();

        communityMemberRepository.save(owner);

        return convertToResponse(savedCommunity, user);
    }

    @Transactional(readOnly = true)
    public Page<CommunityResponseDto> getCommunities(
            Authentication authentication,
            int page,
            int size
    ) {
        User user = getAuthenticatedUser(authentication);

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(Sort.Direction.DESC, "createdAt")
        );

        return communityRepository
                .findByActiveTrue(pageable)
                .map(community -> convertToResponse(community, user));
    }

    @Transactional(readOnly = true)
    public CommunityResponseDto getCommunity(Authentication authentication, Long communityId) {

        User user = getAuthenticatedUser(authentication);
        Community community = getActiveCommunity(communityId);

        return convertToResponse(community, user);
    }

    @Transactional
    public CommunityResponseDto updateCommunity(Authentication authentication,
                                                Long communityId, CommunityCreateRequestDto requestDto) {
        User user = getAuthenticatedUser(authentication);
        Community community = getActiveCommunity(communityId);

        CommunityMember communityMember = communityMemberRepository.findByCommunityIdAndUserId(
                communityId,user.getId()
        ).orElseThrow(()-> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Your not member of this community"));

        if(communityMember.getRole() != CommunityMemberRole.OWNER){
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only the community owner can update the community");
        }
        String name = requestDto.getName().trim();

        if (!community.getName().equalsIgnoreCase(name)
                && communityRepository.existsByNameIgnoreCase(name)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "A community with this name already exists");
        }

        community.setName(name);
        community.setDescription(clean(requestDto.getDescription()));
        community.setCategory(clean(requestDto.getCategory()));
        community.setCoverImageUrl(clean(requestDto.getCoverImageUrl()));
        community.setIconUrl(clean(requestDto.getIconUrl()));

        Community saved = communityRepository.save(community);

        return convertToResponse(saved, user);
    }

    @Transactional
    public void deleteCommunity(Authentication authentication, Long communityId) {

        User user = getAuthenticatedUser(authentication);

        Community community = getActiveCommunity(communityId);

        CommunityMember membership =
                communityMemberRepository
                        .findByCommunityIdAndUserId(communityId, user.getId())
                        .orElseThrow(() ->
                                new ResponseStatusException(HttpStatus.BAD_REQUEST, "You are not a member of this community")
                        );

        if (membership.getRole() != CommunityMemberRole.OWNER) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only the community owner can delete the community");
        }

        // Soft delete
        community.setActive(false);

        communityRepository.save(community);
    }

    @Transactional
    public CommunityResponseDto joinCommunity(Authentication authentication, Long communityId) {
            User user = getAuthenticatedUser(authentication);
            Community community = getActiveCommunity(communityId);
            boolean alreadyMember = communityMemberRepository
                    .existsByCommunityIdAndUserId(communityId,user.getId());
        if (alreadyMember) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "You are already a member of this community");
        }
        CommunityMember member = CommunityMember.builder()
                .community(community)
                .user(user)
                .role(CommunityMemberRole.MEMBER)
                .build();
        communityMemberRepository.save(member);

        return convertToResponse(community, user);
    }

    @Transactional
    public void leaveCommunity(Authentication authentication, Long communityId) {
        User user = getAuthenticatedUser(authentication);
        Community community = getActiveCommunity(communityId);
        CommunityMember communityMember = communityMemberRepository.findByCommunityIdAndUserId(
                communityId,user.getId()
        ).orElseThrow(()-> new ResponseStatusException(HttpStatus.BAD_REQUEST, "You are not a member of this community"));
       if(communityMember.getRole() == CommunityMemberRole.OWNER){
           throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Community owner cannot leave the community");
       }
       communityMemberRepository.deleteByCommunityIdAndUserId(communityId,user.getId());
    }

    @Transactional(readOnly = true)
    public Page<CommunityMemberResponseDto> getMembers(
            Authentication authentication,
            Long communityId,
            int page,
            int size
    ) {

        User currentUser = getAuthenticatedUser(authentication);

        Community community = getActiveCommunity(communityId);

        // Only members can view the member list
        if (!communityMemberRepository.existsByCommunityIdAndUserId(
                communityId,
                currentUser.getId()
        )) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Join the community to view its members");
        }

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(
                        Sort.Direction.ASC,
                        "joinedAt"
                )
        );

        return communityMemberRepository
                .findByCommunityIdOrderByJoinedAtAsc(
                        communityId,
                        pageable
                )
                .map(member ->
                        CommunityMemberResponseDto.builder()
                                .userId(member.getUser().getId())
                                .userName(member.getUser().getUserName())
                                .role(member.getRole())
                                .avatarUrl(
                                        getAvatarUrl(
                                                member.getUser().getId()
                                        )
                                )
                                .joinedAt(member.getJoinedAt())
                                .build()
                );
    }

    private String getAvatarUrl(Long id) {
        UserProfile userProfile = userProfileRepository.findByUserId(id).orElseThrow(()->
                new UsernameNotFoundException("user not found"));
        return userProfile.getAvatarUrl();
    }

    private Community getActiveCommunity(Long communityId) {
        return communityRepository.findByIdAndActiveTrue(communityId).orElseThrow(()-> new ResponseStatusException(HttpStatus.NOT_FOUND, "community not found"));
    }
    private User getAuthenticatedUser(Authentication authentication) {
        String email = authentication.getName();
        return userRepository.findByEmailIgnoreCase(email).orElseThrow(() -> new AuthenticatedUserNotFoundException("user not found"));
    }
    private String clean(String value) {

        if (value == null) {
            return null;
        }

        String cleaned = value.trim();

        return cleaned.isEmpty()
                ? null
                : cleaned;
    }
    private CommunityResponseDto convertToResponse(Community community, User currentUser) {

        var membership = communityMemberRepository
                .findByCommunityIdAndUserId(community.getId(), currentUser.getId());

        return CommunityResponseDto.builder()
                .id(community.getId())
                .name(community.getName())
                .description(community.getDescription())
                .category(community.getCategory())
                .coverImageUrl(community.getCoverImageUrl())
                .iconUrl(community.getIconUrl())
                .createdById(community.getCreatedBy().getId())
                .createdByName(community.getCreatedBy().getUserName())
                .memberCount(communityMemberRepository.countByCommunityId(community.getId()))
                .joined(membership.isPresent())
                .currentUserRole(
                        membership
                                .map(CommunityMember::getRole)
                                .orElse(null)
                )
                .createdAt(community.getCreatedAt())
                .build();
    }
}
