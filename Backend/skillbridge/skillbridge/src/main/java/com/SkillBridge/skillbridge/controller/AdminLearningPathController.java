package com.SkillBridge.skillbridge.controller;

import com.SkillBridge.skillbridge.dto.LearningPathRequestDto;
import com.SkillBridge.skillbridge.dto.LearningPathResponseDto;
import com.SkillBridge.skillbridge.dto.LearningPathTopicRequestDto;
import com.SkillBridge.skillbridge.dto.LearningPathTopicResponseDto;
import com.SkillBridge.skillbridge.service.AdminLearningPathService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/learning-paths")
@RequiredArgsConstructor
public class AdminLearningPathController {

    private final AdminLearningPathService learningPathService;


    @PostMapping
    public ResponseEntity<LearningPathResponseDto> createPath(@Valid @RequestBody LearningPathRequestDto request) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(learningPathService.createPath(request));
    }

    @GetMapping
    public ResponseEntity<List<LearningPathResponseDto>> getAllPaths() {

        return ResponseEntity.ok(learningPathService.getAllPaths());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LearningPathResponseDto> getPath(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(learningPathService.getPath(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LearningPathResponseDto> updatePath(
            @PathVariable Long id,
            @Valid @RequestBody LearningPathRequestDto request
    ) {

        return ResponseEntity.ok(learningPathService.updatePath(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deactivatePath(
            @PathVariable Long id
    ) {

        learningPathService.deactivatePath(id);

        return ResponseEntity.ok(Map.of("message", "Learning path deactivated successfully"));
    }

    @PatchMapping("/{id}/activate")
    public ResponseEntity<Map<String, String>> activatePath(@PathVariable Long id) {

        learningPathService.activatePath(id);

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Learning path activated successfully"
                )
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Topics
    |--------------------------------------------------------------------------
    */

    @PostMapping("/{pathId}/topics")
    public ResponseEntity<LearningPathTopicResponseDto> addTopic(
            @PathVariable Long pathId,
            @Valid @RequestBody LearningPathTopicRequestDto request
    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(learningPathService.addTopic(pathId, request));
    }

    @GetMapping("/{pathId}/topics")
    public ResponseEntity<List<LearningPathTopicResponseDto>> getTopics(
            @PathVariable Long pathId
    ) {

        return ResponseEntity.ok(learningPathService.getTopics(pathId));
    }

    @PutMapping("/{pathId}/topics/{topicId}")
    public ResponseEntity<LearningPathTopicResponseDto> updateTopic(
            @PathVariable Long pathId,
            @PathVariable Long topicId,
            @Valid @RequestBody LearningPathTopicRequestDto request
    ) {

        return ResponseEntity.ok(learningPathService.updateTopic(pathId, topicId, request));
    }

    @DeleteMapping("/{pathId}/topics/{topicId}")
    public ResponseEntity<Map<String, String>> deactivateTopic(
            @PathVariable Long pathId,
            @PathVariable Long topicId
    ) {
        learningPathService.deactivateTopic(pathId, topicId);

        return ResponseEntity.ok(Map.of("message", "Topic deactivated successfully"));
    }

    @PatchMapping("/{pathId}/topics/{topicId}/activate")
    public ResponseEntity<Map<String, String>> activateTopic(
            @PathVariable Long pathId,
            @PathVariable Long topicId
    ) {
        learningPathService.activateTopic(pathId, topicId);

        return ResponseEntity.ok(
                Map.of("message", "Topic activated successfully")
        );
    }
}