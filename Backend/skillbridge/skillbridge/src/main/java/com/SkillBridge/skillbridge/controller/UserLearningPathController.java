package com.SkillBridge.skillbridge.controller;

import com.SkillBridge.skillbridge.dto.LearningPathListResponseDto;
import com.SkillBridge.skillbridge.dto.UserLearningPathResponseDto;
import com.SkillBridge.skillbridge.service.UserLearningPathService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/learning-paths")
@RequiredArgsConstructor
public class UserLearningPathController {

    private final UserLearningPathService userLearningPathService;

    @PostMapping("/{learningPathId}/start")
    public ResponseEntity<UserLearningPathResponseDto> startLearningPath(@PathVariable Long learningPathId) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(userLearningPathService.startLearningPath(learningPathId));
    }

    @GetMapping("/{learningPathId}/me")
    public ResponseEntity<UserLearningPathResponseDto> getMyLearningPath(@PathVariable Long learningPathId) {
        return ResponseEntity.ok(userLearningPathService.getMyLearningPath(learningPathId));
    }

    @PostMapping("/{learningPathId}/topics/{topicId}/start")
    public ResponseEntity<UserLearningPathResponseDto> startTopic(
            @PathVariable Long learningPathId,
            @PathVariable Long topicId
    ) {
        return ResponseEntity.ok(userLearningPathService.startTopic(learningPathId, topicId));
    }

    @PostMapping("/{learningPathId}/topics/{topicId}/complete")
    public ResponseEntity<UserLearningPathResponseDto> completeTopic(
            @PathVariable Long learningPathId,
            @PathVariable Long topicId
    ) {
        return ResponseEntity.ok(userLearningPathService.completeTopic(learningPathId, topicId));
    }

    @GetMapping
    public ResponseEntity<List<LearningPathListResponseDto>> getAvailableLearningPaths() {
        return ResponseEntity.ok(userLearningPathService.getAvailableLearningPaths());
    }
}