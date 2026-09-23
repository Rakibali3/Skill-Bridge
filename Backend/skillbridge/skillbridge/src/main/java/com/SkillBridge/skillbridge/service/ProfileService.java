package com.SkillBridge.skillbridge.service;

import com.SkillBridge.skillbridge.ExceptionHandling.AuthenticatedUserNotFoundException;
import com.SkillBridge.skillbridge.dto.AvatarUpdateRequestDto;
import com.SkillBridge.skillbridge.dto.ProfileResponseDto;
import com.SkillBridge.skillbridge.dto.ProfileSkillResponseDto;
import com.SkillBridge.skillbridge.dto.ProfileUpdateRequestDto;
import com.SkillBridge.skillbridge.entity.User;
import com.SkillBridge.skillbridge.entity.UserProfile;
import com.SkillBridge.skillbridge.entity.UserSkill;
import com.SkillBridge.skillbridge.repository.UserProfileRepository;
import com.SkillBridge.skillbridge.repository.UserRepository;
import com.SkillBridge.skillbridge.repository.UserSkillRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final UserSkillRepository userSkillRepository;
    private final MatchingService matchingService;


    // =========================================================
    // GET MY PROFILE
    // =========================================================

    @Transactional
    public ProfileResponseDto getProfile(
            Authentication authentication
    ) {

        User user = getAuthenticatedUser(authentication);

        UserProfile profile =
                userProfileRepository
                        .findByUserId(user.getId())
                        .orElseGet(() -> createEmptyProfile(user));

        return convertToResponse(user, profile);
    }


    // =========================================================
    // UPDATE MY PROFILE
    // =========================================================

    @Transactional
    public ProfileResponseDto updateProfile(
            Authentication authentication,
            ProfileUpdateRequestDto request
    ) {

        User user = getAuthenticatedUser(authentication);

        UserProfile profile =
                userProfileRepository
                        .findByUserId(user.getId())
                        .orElseGet(() -> createEmptyProfile(user));

        profile.setBio(request.getBio());
        profile.setLocation(request.getLocation());
        profile.setExperience(request.getExperience());
        profile.setLearningStyle(request.getLearningStyle());
        profile.setPreferredFormat(request.getPreferredFormat());
        profile.setAvailability(request.getAvailability());

        userProfileRepository.save(profile);

        matchingService.refreshMatchesForUser(user.getId());

        return convertToResponse(user, profile);
    }


    // =========================================================
    // UPDATE AVATAR
    // =========================================================

    @Transactional
    public ProfileResponseDto updateAvatar(
            Authentication authentication,
            AvatarUpdateRequestDto request
    ) {

        User user = getAuthenticatedUser(authentication);

        UserProfile profile =
                userProfileRepository
                        .findByUserId(user.getId())
                        .orElseGet(() -> createEmptyProfile(user));

        profile.setAvatarUrl(request.getAvatarUrl());

        userProfileRepository.save(profile);

        return convertToResponse(user, profile);
    }


    // =========================================================
    // GET USER PROFILE BY USER ID
    // =========================================================

    @Transactional
    public ProfileResponseDto getUserById(
            Authentication authentication,
            Long userId
    ) {

        // Make sure requester is authenticated
        getAuthenticatedUser(authentication);

        /*
         * IMPORTANT:
         *
         * userId means User.id.
         *
         * Do NOT use:
         *
         * findById(userId)
         *
         * because that searches UserProfile.id.
         */
        User user =
                userRepository.findById(userId)
                        .orElseThrow(() ->
                                new AuthenticatedUserNotFoundException(
                                        "User not found"
                                )
                        );

        UserProfile profile =
                userProfileRepository
                        .findByUserId(userId)
                        .orElseGet(() -> createEmptyProfile(user));

        return convertToResponse(user, profile);
    }


    // =========================================================
    // CONVERT PROFILE TO RESPONSE
    // =========================================================

    private ProfileResponseDto convertToResponse(
            User user,
            UserProfile profile
    ) {

        List<ProfileSkillResponseDto> skills =
                userSkillRepository
                        .findByUserId(user.getId())
                        .stream()
                        .map(this::convertSkillToResponse)
                        .toList();

        return ProfileResponseDto.builder()

                /*
                 * IMPORTANT:
                 *
                 * Return User.id
                 * NOT UserProfile.id
                 */
                .id(user.getId())

                .userName(user.getUserName())
                .email(user.getEmail())

                .bio(profile.getBio())
                .location(profile.getLocation())
                .experience(profile.getExperience())
                .learningStyle(profile.getLearningStyle())
                .preferredFormat(profile.getPreferredFormat())
                .availability(profile.getAvailability())
                .avatarUrl(profile.getAvatarUrl())

                .skills(skills)

                .build();
    }


    // =========================================================
    // CONVERT USER SKILL
    // =========================================================

    private ProfileSkillResponseDto convertSkillToResponse(
            UserSkill userSkill
    ) {

        return ProfileSkillResponseDto.builder()

                /*
                 * ID from user_skills table
                 *
                 * Example:
                 * Harsha React = 9
                 */
                .userSkillId(userSkill.getId())

                /*
                 * ID from skills table
                 *
                 * Example:
                 * React = 1
                 */
                .skillId(userSkill.getSkill().getId())

                .skillName(userSkill.getSkill().getName())

                .category(userSkill.getSkill().getCategory())

                .skillType(userSkill.getSkillType())

                .build();
    }


    // =========================================================
    // CREATE EMPTY PROFILE
    // =========================================================

    private UserProfile createEmptyProfile(User user) {

        UserProfile profile =
                UserProfile.builder()
                        .user(user)
                        .build();

        return userProfileRepository.save(profile);
    }


    // =========================================================
    // GET AUTHENTICATED USER
    // =========================================================

    private User getAuthenticatedUser(
            Authentication authentication
    ) {

        String email = authentication.getName();

        return userRepository
                .findByEmailIgnoreCase(email)
                .orElseThrow(() ->
                        new AuthenticatedUserNotFoundException(
                                "Authenticated User Not Found"
                        )
                );
    }
}