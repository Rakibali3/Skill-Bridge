package com.SkillBridge.skillbridge.service;

import com.SkillBridge.skillbridge.ExceptionHandling.SkillNotFoundException;
import com.SkillBridge.skillbridge.ExceptionHandling.SkillUnavailableException;
import com.SkillBridge.skillbridge.dto.LearningPathRequestDto;
import com.SkillBridge.skillbridge.dto.LearningPathResponseDto;
import com.SkillBridge.skillbridge.dto.LearningPathTopicRequestDto;
import com.SkillBridge.skillbridge.dto.LearningPathTopicResponseDto;
import com.SkillBridge.skillbridge.entity.LearningPath;
import com.SkillBridge.skillbridge.entity.LearningPathTopic;
import com.SkillBridge.skillbridge.entity.Skill;
import com.SkillBridge.skillbridge.entity.UserSkill;
import com.SkillBridge.skillbridge.enums.NotificationType;
import com.SkillBridge.skillbridge.enums.SkillType;
import com.SkillBridge.skillbridge.repository.LearningPathRepository;
import com.SkillBridge.skillbridge.repository.LearningPathTopicRepository;
import com.SkillBridge.skillbridge.repository.SkillRepository;
import com.SkillBridge.skillbridge.repository.UserSkillRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminLearningPathService {
    private final LearningPathRepository learningPathRepository;
    private final LearningPathTopicRepository learningPathTopicRepository;
    private final SkillRepository skillRepository;
    private final UserSkillRepository userSkillRepository;
    private final NotificationService notificationService;

    public LearningPathResponseDto createPath(@Valid LearningPathRequestDto request) {
        Skill skill = skillRepository.findById(request.getSkillId())
                .orElseThrow(() -> new SkillNotFoundException("skill not found"));

        if(!skill.isActive()){
            throw new SkillUnavailableException("Cannot create a learning path for an inactive skill");
        }

        if(learningPathRepository.existsBySkillId(request.getSkillId())){
            throw new ResponseStatusException(HttpStatus.CONFLICT, "A learning path already exists for this skill");
        }

        LearningPath learningPath = LearningPath.builder()
                .skill(skill)
                .title(request.getTitle().trim())
                .description(clean(request.getDescription()))
                .active(true)
                .build();

        LearningPath saved = learningPathRepository.save(learningPath);

        notifyLearnersAboutPath(
                saved,
                NotificationType.LEARNING_PATH_CREATED,
                "New learning path available",
                "A new learning path for "
                        + saved.getSkill().getName()
                        + " is now available."
        );

        return mapPath(saved);
    }

    @Transactional(readOnly = true)
    public List<LearningPathResponseDto> getAllPaths() {
        return learningPathRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapPath)
                .toList();
    }

    @Transactional(readOnly = true)
    public LearningPathResponseDto getPath(Long id) {
        LearningPath learningPath = getPathEntity(id);
        return mapPath(learningPath);
    }

    public LearningPathResponseDto updatePath(Long id, @Valid LearningPathRequestDto request) {
        LearningPath learningPath = getPathEntity(id);
        Skill skill = skillRepository.findById(request.getSkillId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Skill not found"));

        if (!skill.isActive()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot use an inactive skill");
        }

        learningPathRepository.findBySkillId(skill.getId())
                .ifPresent(existingPath -> {

                    if (!existingPath.getId().equals(id)) {
                        throw new ResponseStatusException(HttpStatus.CONFLICT, "A learning path already exists for this skill");
                    }
                });

        learningPath.setSkill(skill);
        learningPath.setTitle(request.getTitle().trim());
        learningPath.setDescription(clean(request.getDescription()));

        LearningPath saved = learningPathRepository.save(learningPath);

        notifyLearnersAboutPath(
                saved,
                NotificationType.LEARNING_PATH_UPDATED,
                "Learning path updated",
                "The learning path for "
                        + saved.getSkill().getName()
                        + " has been updated."
        );

        return mapPath(saved);

    }

    public void deactivatePath(Long id) {
        LearningPath path = getPathEntity(id);
        path.setActive(false);
        learningPathRepository.save(path);
    }

    public void activatePath(Long id) {
        LearningPath path = getPathEntity(id);
        if (!path.getSkill().isActive()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot activate a path for an inactive skill");
        }

        path.setActive(true);

        learningPathRepository.save(path);
    }

    public LearningPathTopicResponseDto addTopic(Long pathId, @Valid LearningPathTopicRequestDto request) {
        LearningPath learningPath = getPathEntity(pathId);
        if (!learningPath.isActive()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot add a topic to an inactive learning path");
        }
        LearningPathTopic topic = LearningPathTopic.builder()
                .learningPath(learningPath)
                .title(request.getTitle().trim())
                .description(clean(request.getDescription()))
                .orderIndex(request.getOrderIndex())
                .resourceUrl(clean(request.getResourceUrl()))
                .active(true)
                .build();

        LearningPathTopic saved = learningPathTopicRepository.save(topic);

        return mapTopic(saved);
    }

    public LearningPathTopicResponseDto updateTopic(Long pathId, Long topicId, @Valid LearningPathTopicRequestDto request) {
        LearningPath learningPath = getPathEntity(pathId);
        if(!learningPath.isActive()){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "cannot update topic in deactivated learning path");
        }
        LearningPathTopic topic = learningPathTopicRepository.findById(topicId)
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Topic not found"));

        if (!topic.getLearningPath().getId().equals(pathId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Topic does not belong to this learning path");
        }

        topic.setTitle(request.getTitle().trim());
        topic.setDescription(clean(request.getDescription()));
        topic.setOrderIndex(request.getOrderIndex());
        topic.setResourceUrl(clean(request.getResourceUrl()));

        LearningPathTopic saved = learningPathTopicRepository.save(topic);

        return mapTopic(saved);
    }

    public List<LearningPathTopicResponseDto> getTopics(Long pathId) {
        getPathEntity(pathId);
        return learningPathTopicRepository
                .findByLearningPathIdOrderByOrderIndexAsc(pathId)
                .stream()
                .map(this::mapTopic)
                .toList();
    }

    public void deactivateTopic(Long pathId, Long topicId) {

        LearningPathTopic topic = getTopic(pathId, topicId);

        topic.setActive(false);

        learningPathTopicRepository.save(topic);
    }

    public void activateTopic(Long pathId, Long topicId) {

        LearningPathTopic topic = getTopic(pathId, topicId);

        topic.setActive(true);

        learningPathTopicRepository.save(topic);
    }

    private LearningPath getPathEntity(Long id) {
        return learningPathRepository.findById(id).orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Learning path not found"));
    }

    private LearningPathTopic getTopic(Long pathId, Long topicId) {
        LearningPathTopic topic = learningPathTopicRepository.findById(topicId).orElseThrow(()->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "topic not found"));
        if(!topic.getLearningPath().getId().equals(pathId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Topic does not belong to this learning path");
        }
        return topic;
    }

    private LearningPathResponseDto mapPath(LearningPath path) {

        return LearningPathResponseDto.builder()
                .id(path.getId())
                .skillId(path.getSkill().getId())
                .skillName(path.getSkill().getName())
                .title(path.getTitle())
                .description(path.getDescription())
                .active(path.isActive())
                .createdAt(path.getCreatedAt())
                .updatedAt(path.getUpdatedAt())
                .build();
    }

    private LearningPathTopicResponseDto mapTopic(LearningPathTopic topic) {
        return LearningPathTopicResponseDto.builder()
                .id(topic.getId())
                .learningPathId(topic.getLearningPath().getId())
                .title(topic.getTitle())
                .description(topic.getDescription())
                .orderIndex(topic.getOrderIndex())
                .resourceUrl(topic.getResourceUrl())
                .active(topic.isActive())
                .build();
    }

    private String clean(String value) {

        if (value == null) {
            return null;
        }

        String cleaned = value.trim();

        return cleaned.isEmpty() ? null : cleaned;
    }

    private void notifyLearnersAboutPath(
            LearningPath learningPath,
            NotificationType type,
            String title,
            String message
    ) {
        List<UserSkill> learners =
                userSkillRepository.findBySkillIdAndSkillType(
                        learningPath.getSkill().getId(),
                        SkillType.LEARN
                );

        Set<Long> notifiedUserIds = new HashSet<>();

        for (UserSkill userSkill : learners) {

            Long recipientId = userSkill.getUser().getId();

            if (!notifiedUserIds.add(recipientId)) {
                continue;
            }

            notificationService.createNotification(
                    recipientId,
                    type,
                    title,
                    message,
                    "/learning-paths/" + learningPath.getId()
            );
        }
    }

}
