package com.SkillBridge.skillbridge.service;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import com.SkillBridge.skillbridge.dto.LearningPathListResponseDto;
import com.SkillBridge.skillbridge.dto.LearningPathTopicProgressResponseDto;
import com.SkillBridge.skillbridge.dto.UserLearningPathResponseDto;
import com.SkillBridge.skillbridge.entity.*;
import com.SkillBridge.skillbridge.enums.LearningPathProgressStatus;
import com.SkillBridge.skillbridge.repository.LearningPathRepository;
import com.SkillBridge.skillbridge.repository.LearningPathTopicRepository;
import com.SkillBridge.skillbridge.repository.UserLearningPathRepository;
import com.SkillBridge.skillbridge.repository.UserLearningPathTopicRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserLearningPathService {

    private final UserLearningPathRepository userLearningPathRepository;
    private final UserLearningPathTopicRepository userLearningPathTopicRepository;
    private final LearningPathRepository learningPathRepository;
    private final LearningPathTopicRepository learningPathTopicRepository;
    private final UserService userService;

    @Transactional
    public UserLearningPathResponseDto startLearningPath(Long learningPathId) {
        User user = userService.getCurrentUser();

        LearningPath learningPath = learningPathRepository.findById(learningPathId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Learning path not found"));

        if (!learningPath.isActive()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This learning path is currently inactive");
        }

        UserLearningPath userLearningPath = userLearningPathRepository
                .findByUserIdAndLearningPathId(user.getId(), learningPathId)
                .orElse(null);

        if (userLearningPath == null) {
            userLearningPath = UserLearningPath.builder()
                    .user(user)
                    .learningPath(learningPath)
                    .status(LearningPathProgressStatus.IN_PROGRESS)
                    .progress(0)
                    .build();

            userLearningPath = userLearningPathRepository.save(userLearningPath);
            createTopicProgress(userLearningPath, learningPathId);
        }

        return mapToResponse(userLearningPath);
    }

    @Transactional
    public UserLearningPathResponseDto getMyLearningPath(Long learningPathId) {

        User user = userService.getCurrentUser();

        UserLearningPath userLearningPath = userLearningPathRepository
                        .findByUserIdAndLearningPathId(user.getId(), learningPathId)
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "You have not started this learning path"));

        syncTopicProgress(userLearningPath);

        updateLearningPathProgress(userLearningPath);

        return mapToResponse(userLearningPath);
    }

    @Transactional
    public UserLearningPathResponseDto startTopic(Long learningPathId, Long topicId) {
        User user = userService.getCurrentUser();

        UserLearningPath userLearningPath = userLearningPathRepository
                .findByUserIdAndLearningPathId(user.getId(), learningPathId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "You have not started this learning path"));

        UserLearningPathTopic topicProgress = userLearningPathTopicRepository
                .findByUserLearningPathIdAndLearningPathTopicId(userLearningPath.getId(), topicId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Topic not found in this learning path"));

        if (!topicProgress.getLearningPathTopic().isActive()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This topic is currently inactive");
        }

        if (topicProgress.getStatus() == LearningPathProgressStatus.NOT_STARTED) {
            topicProgress.setStatus(LearningPathProgressStatus.IN_PROGRESS);
            topicProgress.setProgress(0);
            topicProgress.setStartedAt(LocalDateTime.now());
            userLearningPathTopicRepository.save(topicProgress);
        }

        updateLearningPathProgress(userLearningPath);
        return mapToResponse(userLearningPath);
    }

    @Transactional
    public UserLearningPathResponseDto completeTopic(Long learningPathId, Long topicId) {
        User user = userService.getCurrentUser();

        UserLearningPath userLearningPath = userLearningPathRepository
                .findByUserIdAndLearningPathId(user.getId(), learningPathId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "You have not started this learning path"));

        UserLearningPathTopic topicProgress = userLearningPathTopicRepository
                .findByUserLearningPathIdAndLearningPathTopicId(userLearningPath.getId(), topicId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Topic not found in this learning path"));

        if (!topicProgress.getLearningPathTopic().isActive()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This topic is currently inactive");
        }

        topicProgress.setStatus(LearningPathProgressStatus.COMPLETED);
        topicProgress.setProgress(100);
        topicProgress.setCompletedAt(LocalDateTime.now());
        userLearningPathTopicRepository.save(topicProgress);

        updateLearningPathProgress(userLearningPath);
        return mapToResponse(userLearningPath);
    }

    @Transactional(readOnly = true)
    public List<LearningPathListResponseDto> getAvailableLearningPaths() {

        User user = userService.getCurrentUser();

        List<LearningPath> learningPaths = learningPathRepository.findByActiveTrueOrderByCreatedAtDesc();

        return learningPaths.stream()
                .map(path -> {

                    Optional<UserLearningPath> userPath =
                            userLearningPathRepository
                                    .findByUserIdAndLearningPathId(
                                            user.getId(),
                                            path.getId()
                                    );

                    int topicCount =
                            learningPathTopicRepository
                                    .findByLearningPathIdAndActiveTrueOrderByOrderIndexAsc(
                                            path.getId()
                                    )
                                    .size();

                    if (userPath.isPresent()) {

                        UserLearningPath progress =
                                userPath.get();

                        return LearningPathListResponseDto.builder()
                                .id(path.getId())
                                .skillId(path.getSkill().getId())
                                .skillName(path.getSkill().getName())
                                .title(path.getTitle())
                                .description(path.getDescription())
                                .topicCount(topicCount)
                                .started(true)
                                .status(progress.getStatus().name())
                                .progress(progress.getProgress())
                                .build();
                    }

                    return LearningPathListResponseDto.builder()
                            .id(path.getId())
                            .skillId(path.getSkill().getId())
                            .skillName(path.getSkill().getName())
                            .title(path.getTitle())
                            .description(path.getDescription())
                            .topicCount(topicCount)
                            .started(false)
                            .status(
                                    LearningPathProgressStatus.NOT_STARTED.name()
                            )
                            .progress(0)
                            .build();
                })
                .toList();
    }

    private void syncTopicProgress(UserLearningPath userLearningPath) {

        Long learningPathId = userLearningPath.getLearningPath().getId();

        // Get all currently active topics from the admin's learning path.
        List<LearningPathTopic> activeTopics = learningPathTopicRepository
                        .findByLearningPathIdAndActiveTrueOrderByOrderIndexAsc(learningPathId);

        // Get the user's existing topic progress records.
        List<UserLearningPathTopic> existingProgress = userLearningPathTopicRepository
                        .findByUserLearningPathIdOrderByLearningPathTopicOrderIndexAsc(userLearningPath.getId());

        // Identify topics that already have progress records.
        Set<Long> existingTopicIds = existingProgress.stream()
                .map(progress -> progress.getLearningPathTopic().getId())
                .collect(Collectors.toSet());

        // Create progress records only for newly added topics.
        for (LearningPathTopic topic : activeTopics) {

            if (!existingTopicIds.contains(topic.getId())) {

                UserLearningPathTopic newProgress =
                        UserLearningPathTopic.builder()
                                .userLearningPath(userLearningPath)
                                .learningPathTopic(topic)
                                .status(LearningPathProgressStatus.NOT_STARTED)
                                .progress(0)
                                .build();

                userLearningPathTopicRepository.save(newProgress);
            }
        }
    }

    private void updateLearningPathProgress(UserLearningPath userLearningPath) {

        List<UserLearningPathTopic> allProgress = userLearningPathTopicRepository
                        .findByUserLearningPathIdOrderByLearningPathTopicOrderIndexAsc(userLearningPath.getId());

        // Only active topics count toward current progress.
        List<UserLearningPathTopic> activeProgress = allProgress.stream()
                        .filter(progress -> progress.getLearningPathTopic().isActive())
                        .toList();

        int totalTopics = activeProgress.size();

        if (totalTopics == 0) {
            userLearningPath.setProgress(0);
            userLearningPath.setStatus(LearningPathProgressStatus.IN_PROGRESS);
            userLearningPath.setCompletedAt(null);

            userLearningPathRepository.save(userLearningPath);
            return;
        }

        long completedTopics = activeProgress.stream()
                .filter(progress -> progress.getStatus() == LearningPathProgressStatus.COMPLETED)
                .count();

        int progress = (int) Math.round(
                (completedTopics * 100.0) / totalTopics
        );

        userLearningPath.setProgress(progress);

        if (completedTopics == totalTopics) {

            userLearningPath.setStatus(LearningPathProgressStatus.COMPLETED);

            userLearningPath.setProgress(100);

            if (userLearningPath.getCompletedAt() == null) {
                userLearningPath.setCompletedAt(LocalDateTime.now());
            }

        } else {
            userLearningPath.setStatus(LearningPathProgressStatus.IN_PROGRESS);

            userLearningPath.setCompletedAt(null);
        }

        userLearningPathRepository.save(userLearningPath);
    }
    private void createTopicProgress(UserLearningPath userLearningPath, Long learningPathId) {
        List<LearningPathTopic> topics = learningPathTopicRepository
                .findByLearningPathIdAndActiveTrueOrderByOrderIndexAsc(learningPathId);

        for (LearningPathTopic topic : topics) {
            UserLearningPathTopic progress = UserLearningPathTopic.builder()
                    .userLearningPath(userLearningPath)
                    .learningPathTopic(topic)
                    .status(LearningPathProgressStatus.NOT_STARTED)
                    .progress(0)
                    .build();

            userLearningPathTopicRepository.save(progress);
        }
    }

    private UserLearningPathResponseDto mapToResponse(UserLearningPath userLearningPath) {
        List<UserLearningPathTopic> topicProgress = userLearningPathTopicRepository
                .findByUserLearningPathIdOrderByLearningPathTopicOrderIndexAsc(userLearningPath.getId());

        List<LearningPathTopicProgressResponseDto> topics = topicProgress.stream()
                .map(this::mapTopicProgress)
                .toList();

        LearningPath learningPath = userLearningPath.getLearningPath();

        return UserLearningPathResponseDto.builder()
                .id(userLearningPath.getId())
                .learningPathId(learningPath.getId())
                .skillName(learningPath.getSkill().getName())
                .title(learningPath.getTitle())
                .description(learningPath.getDescription())
                .status(userLearningPath.getStatus().name())
                .progress(userLearningPath.getProgress())
                .topics(topics)
                .build();
    }

    private LearningPathTopicProgressResponseDto mapTopicProgress(UserLearningPathTopic topicProgress) {
        LearningPathTopic topic = topicProgress.getLearningPathTopic();

        return LearningPathTopicProgressResponseDto.builder()
                .topicId(topic.getId())
                .title(topic.getTitle())
                .description(topic.getDescription())
                .orderIndex(topic.getOrderIndex())
                .resourceUrl(topic.getResourceUrl())
                .status(topicProgress.getStatus().name())
                .progress(topicProgress.getProgress())
                .active(topic.isActive())
                .build();
    }
}