package com.SkillBridge.skillbridge.service;

import com.SkillBridge.skillbridge.ExceptionHandling.AuthenticatedUserNotFoundException;
import com.SkillBridge.skillbridge.dto.MatchResponseDto;
import com.SkillBridge.skillbridge.entity.Match;
import com.SkillBridge.skillbridge.entity.User;
import com.SkillBridge.skillbridge.entity.UserProfile;
import com.SkillBridge.skillbridge.entity.UserSkill;
import com.SkillBridge.skillbridge.enums.SkillType;
import com.SkillBridge.skillbridge.repository.MatchRepository;
import com.SkillBridge.skillbridge.repository.UserProfileRepository;
import com.SkillBridge.skillbridge.repository.UserRepository;
import com.SkillBridge.skillbridge.repository.UserSkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MatchService {

    private final MatchRepository matchRepository;
    private final UserRepository userRepository;
    private final UserSkillRepository userSkillRepository;
    private final UserProfileRepository userProfileRepository;

    public List<MatchResponseDto> getMatches(Authentication authentication) {

        User currentUser = getAuthenticatedUser(authentication);

        List<Match> matches =
                matchRepository.findByUserIdOrderByMatchScoreDesc(
                        currentUser.getId()
                );

        return matches.stream()
                .map(this::convertToResponse)
                .toList();
    }

    private MatchResponseDto convertToResponse(Match match) {

        User matchedUser = match.getMatchedUser();

        List<UserSkill> matchedUserSkills = userSkillRepository.findByUserId(matchedUser.getId());
        UserProfile profile = userProfileRepository.findByUserId(matchedUser.getId()).orElse(null);

        List<String> canTeach = matchedUserSkills.stream()
                .filter(skill -> skill.getSkillType() == SkillType.TEACH)
                .map(userSkill -> userSkill.getSkill().getName())
                .toList();

        List<String> wantsToLearn = matchedUserSkills.stream()
                .filter(skill -> skill.getSkillType() == SkillType.LEARN)
                .map(userSkill -> userSkill.getSkill().getName())
                .toList();

        return MatchResponseDto.builder()
                .userId(matchedUser.getId())
                .userName(matchedUser.getUserName())
                .email(matchedUser.getEmail())
                .location(profile != null ? profile.getLocation() : null)
                .avatarUrl(profile != null ? profile.getAvatarUrl() : null)
                .experience(profile != null ? profile.getExperience() : null)
                .preferredFormat(profile != null ? profile.getPreferredFormat() : null)
                .availability(profile != null ? profile.getAvailability() : null)
                .matchScore(match.getMatchScore())
                .canTeach(canTeach)
                .wantsToLearn(wantsToLearn)
                .build();
    }

    private User getAuthenticatedUser(Authentication authentication) {

        String email = authentication.getName();

        return userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() ->
                        new AuthenticatedUserNotFoundException("Authenticated user not found")
                );
    }
}