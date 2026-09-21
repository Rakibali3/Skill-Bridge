package com.SkillBridge.skillbridge.service;

import com.SkillBridge.skillbridge.entity.Match;
import com.SkillBridge.skillbridge.entity.UserProfile;
import com.SkillBridge.skillbridge.entity.UserSkill;
import com.SkillBridge.skillbridge.enums.SkillType;
import com.SkillBridge.skillbridge.repository.MatchRepository;
import com.SkillBridge.skillbridge.repository.UserProfileRepository;
import com.SkillBridge.skillbridge.repository.UserRepository;
import com.SkillBridge.skillbridge.repository.UserSkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional
public class MatchingService {

    private final UserSkillRepository userSkillRepository;
    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final MatchRepository matchRepository;

    public void refreshMatchesForUser(Long userId) {
        List<UserSkill> currentUserSkills = userSkillRepository.findByUserId(userId);

        // Remove old matches involving this user
        matchRepository.deleteByUserId(userId);
        matchRepository.deleteByMatchedUserId(userId);
        matchRepository.flush();

        if (currentUserSkills.isEmpty()) {
            return;
        }

        Set<Long> candidateUserIds = findCandidateUsers(userId, currentUserSkills);

        for (Long matchedUserId : candidateUserIds) {
            calculateAndSaveMatch(userId, matchedUserId);
            calculateAndSaveMatch(matchedUserId, userId);
        }
    }

    private Set<Long> findCandidateUsers(Long userId, List<UserSkill> currentUserSkills) {
        Set<Long> candidateUserIds = new HashSet<>();

        for (UserSkill currentSkill : currentUserSkills) {
            SkillType oppositeType = currentSkill.getSkillType() == SkillType.TEACH ? SkillType.LEARN : SkillType.TEACH;
            List<UserSkill> potentialMatches = userSkillRepository.findBySkillIdAndSkillType(currentSkill.getSkill().getId(), oppositeType);

            for (UserSkill potentialMatch : potentialMatches) {
                Long potentialUserId = potentialMatch.getUser().getId();
                if (!potentialUserId.equals(userId)) {
                    candidateUserIds.add(potentialUserId);
                }
            }
        }

        return candidateUserIds;
    }

    private void calculateAndSaveMatch(Long userId, Long matchedUserId) {
        List<UserSkill> currentUserSkills = userSkillRepository.findByUserId(userId);
        List<UserSkill> matchedUserSkills = userSkillRepository.findByUserId(matchedUserId);

        double skillScore = MatchingAlgorithm.calculateSkillScore(currentUserSkills, matchedUserSkills);
        double levelScore = MatchingAlgorithm.calculateLevelScore(currentUserSkills, matchedUserSkills);

        UserProfile currentProfile = userProfileRepository.findByUserId(userId).orElse(null);
        UserProfile matchedProfile = userProfileRepository.findByUserId(matchedUserId).orElse(null);

        double profileScore = MatchingAlgorithm.calculateProfileScore(currentProfile, matchedProfile);

        double finalScore = (skillScore * 0.70) + (levelScore * 0.20) + (profileScore * 0.10);

        saveMatch(userId, matchedUserId, finalScore);
    }

    private void saveMatch(Long userId, Long matchedUserId, double score) {
        Match match = Match.builder()
                .user(userRepository.getReferenceById(userId))
                .matchedUser(userRepository.getReferenceById(matchedUserId))
                .matchScore(score)
                .build();

        matchRepository.save(match);
    }
}