package com.SkillBridge.skillbridge.service;

import com.SkillBridge.skillbridge.ExceptionHandling.AuthenticatedUserNotFoundException;
import com.SkillBridge.skillbridge.dto.AvatarUpdateRequestDto;
import com.SkillBridge.skillbridge.dto.ProfileResponseDto;
import com.SkillBridge.skillbridge.dto.ProfileUpdateRequestDto;
import com.SkillBridge.skillbridge.entity.User;
import com.SkillBridge.skillbridge.entity.UserProfile;
import com.SkillBridge.skillbridge.repository.UserProfileRepository;
import com.SkillBridge.skillbridge.repository.UserRepository;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProfileService {
    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final MatchingService matchingService;

    @Transactional
    public ProfileResponseDto getProfile(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        UserProfile profile = userProfileRepository.findByUserId(user.getId()).orElseGet(()
                -> createEmptyProfile(user));
        return convertToResponse(user,profile);
    }

    @Transactional
    public ProfileResponseDto updateProfile(Authentication authentication, ProfileUpdateRequestDto request) {
        User user = getAuthenticatedUser(authentication);
        UserProfile profile = userProfileRepository.findByUserId(user.getId()).orElseGet(()
                -> createEmptyProfile(user));

        profile.setBio(request.getBio());
        profile.setLocation(request.getLocation());
        profile.setExperience(request.getExperience());
        profile.setLearningStyle(request.getLearningStyle());
        profile.setPreferredFormat(request.getPreferredFormat());
        profile.setAvailability(request.getAvailability());

        userProfileRepository.save(profile);
        matchingService.refreshMatchesForUser(user.getId());
        return convertToResponse(user,profile);
    }

    @Transactional
    public ProfileResponseDto updateAvatar(Authentication authentication, AvatarUpdateRequestDto request) {
        User user = getAuthenticatedUser(authentication);

        UserProfile profile = userProfileRepository
                .findByUserId(user.getId())
                .orElseGet(() -> createEmptyProfile(user));

        profile.setAvatarUrl(request.getAvatarUrl());

        userProfileRepository.save(profile);

        return convertToResponse(user, profile);
    }

    private ProfileResponseDto convertToResponse(User user, UserProfile profile) {
        return ProfileResponseDto.builder()
                .id(profile.getId())
                .userName(user.getUserName())
                .email(user.getEmail())
                .bio(profile.getBio())
                .location(profile.getLocation())
                .experience(profile.getExperience())
                .learningStyle(profile.getLearningStyle())
                .preferredFormat(profile.getPreferredFormat())
                .availability(profile.getAvailability())
                .avatarUrl(profile.getAvatarUrl())
                .build();
    }

    public ProfileResponseDto getUserById(Authentication authentication, Long id) {
        getAuthenticatedUser(authentication);
        UserProfile profile = userProfileRepository.findById(id).orElseThrow(()-> new AuthenticatedUserNotFoundException(
                "User profile not found"
        ));
        return ProfileResponseDto.builder()
                .id(profile.getUser().getId())
                .userName(profile.getUser().getUserName())
                .email(profile.getUser().getEmail())
                .bio(profile.getBio())
                .location(profile.getLocation())
                .learningStyle(profile.getLearningStyle())
                .experience(profile.getExperience())
                .preferredFormat(profile.getPreferredFormat())
                .availability(profile.getAvailability())
                .avatarUrl(profile.getAvatarUrl())
                .build();
    }
    private UserProfile createEmptyProfile(User user) {
        UserProfile profile = UserProfile.builder()
                .user(user)
                .build();

        return userProfileRepository.save(profile);
    }

    private User getAuthenticatedUser(Authentication authentication) {
        String Email = authentication.getName();
        return userRepository.findByEmailIgnoreCase(Email).orElseThrow(()->
                new AuthenticatedUserNotFoundException("Authenticated User Not Found"));
    }

}

