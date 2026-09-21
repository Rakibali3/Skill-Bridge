package com.SkillBridge.skillbridge.service;

import com.SkillBridge.skillbridge.entity.UserProfile;
import com.SkillBridge.skillbridge.entity.UserSkill;
import com.SkillBridge.skillbridge.enums.SkillLevel;
import com.SkillBridge.skillbridge.enums.SkillType;

import java.util.List;

public class MatchingAlgorithm {

    private MatchingAlgorithm() {
    }

    public static double calculateSkillScore(List<UserSkill> currentUserSkills, List<UserSkill> matchedUserSkills) {
        if (currentUserSkills == null || currentUserSkills.isEmpty()) {
            return 0;
        }

        int matchedSkills = 0;
        for (UserSkill currentSkill : currentUserSkills) {
            boolean complementaryMatch = matchedUserSkills.stream()
                    .anyMatch(matchedSkill -> isComplementary(currentSkill, matchedSkill));

            if (complementaryMatch) {
                matchedSkills++;
            }
        }

        return ((double) matchedSkills / currentUserSkills.size()) * 100;
    }

    public static double calculateLevelScore(List<UserSkill> currentUserSkills, List<UserSkill> matchedUserSkills) {
        if (currentUserSkills == null || currentUserSkills.isEmpty()) {
            return 0;
        }

        double totalScore = 0;
        int matchedCount = 0;

        for (UserSkill currentSkill : currentUserSkills) {
            for (UserSkill matchedSkill : matchedUserSkills) {
                if (!isComplementary(currentSkill, matchedSkill)) {
                    continue;
                }

                totalScore += calculateLevelCompatibility(currentSkill.getLevel(), matchedSkill.getLevel());
                matchedCount++;
                break;
            }
        }

        return matchedCount == 0 ? 0 : totalScore / matchedCount;
    }

    public static double calculateProfileScore(UserProfile currentProfile, UserProfile matchedProfile) {
        if (currentProfile == null || matchedProfile == null) {
            return 0;
        }

        double experienceScore = calculateExperienceScore(currentProfile.getExperience(), matchedProfile.getExperience());
        double formatScore = calculateFormatScore(currentProfile.getPreferredFormat(), matchedProfile.getPreferredFormat());
        double availabilityScore = calculateAvailabilityScore(currentProfile.getAvailability(), matchedProfile.getAvailability());
        double locationScore = calculateLocationScore(currentProfile.getLocation(), matchedProfile.getLocation());

        return (experienceScore * 0.40) + (formatScore * 0.25) + (availabilityScore * 0.25) + (locationScore * 0.10);
    }

    private static double calculateExperienceScore(String requiredExperience, String actualExperience) {
        if (requiredExperience == null || actualExperience == null) {
            return 0;
        }

        int requiredYears = extractYears(requiredExperience);
        int actualYears = extractYears(actualExperience);

        if (requiredYears < 0 || actualYears < 0) {
            return 0;
        }

        if (actualYears >= requiredYears) {
            return 100;
        }

        if (actualYears == requiredYears - 1) {
            return 50;
        }

        return 0;
    }

    private static int extractYears(String experience) {
        try {
            String number = experience.replaceAll("[^0-9]", "");
            return number.isEmpty() ? -1 : Integer.parseInt(number);
        } catch (NumberFormatException exception) {
            return -1;
        }
    }

    private static double calculateFormatScore(String requiredFormat, String actualFormat) {
        if (requiredFormat == null || actualFormat == null) {
            return 0;
        }

        String required = requiredFormat.trim().toLowerCase();
        String actual = actualFormat.trim().toLowerCase();

        if (required.equals(actual) || containsBoth(actual) || containsBoth(required)) {
            return 100;
        }

        return 0;
    }

    private static double calculateAvailabilityScore(String requiredAvailability, String actualAvailability) {
        if (requiredAvailability == null || actualAvailability == null) {
            return 0;
        }

        String required = requiredAvailability.trim().toLowerCase();
        String actual = actualAvailability.trim().toLowerCase();

        if (required.equals(actual) || actual.contains("flexible") || required.contains("flexible")) {
            return 100;
        }

        return 0;
    }

    private static double calculateLocationScore(String currentLocation, String matchedLocation) {
        if (currentLocation == null || matchedLocation == null) {
            return 0;
        }

        String current = currentLocation.trim();
        String matched = matchedLocation.trim();

        if (current.isEmpty() || matched.isEmpty()) {
            return 0;
        }

        return current.equalsIgnoreCase(matched) ? 100 : 0;
    }

    private static boolean containsBoth(String value) {
        return value.contains("both") || value.contains("online + in person") || value.contains("online and in person");
    }

    private static boolean isComplementary(UserSkill currentSkill, UserSkill matchedSkill) {
        if (!currentSkill.getSkill().getId().equals(matchedSkill.getSkill().getId())) {
            return false;
        }

        return (currentSkill.getSkillType() == SkillType.TEACH && matchedSkill.getSkillType() == SkillType.LEARN)
                || (currentSkill.getSkillType() == SkillType.LEARN && matchedSkill.getSkillType() == SkillType.TEACH);
    }

    private static double calculateLevelCompatibility(SkillLevel currentLevel, SkillLevel matchedLevel) {
        if (currentLevel == null || matchedLevel == null) {
            return 50;
        }

        int current = currentLevel.ordinal();
        int matched = matchedLevel.ordinal();

        if (matched >= current) {
            return 100;
        }

        if (matched == current - 1) {
            return 70;
        }

        return 40;
    }
}