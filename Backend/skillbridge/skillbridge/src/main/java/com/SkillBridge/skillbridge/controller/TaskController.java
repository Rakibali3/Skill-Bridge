package com.SkillBridge.skillbridge.controller;

import com.SkillBridge.skillbridge.dto.TaskCreateRequestDto;
import com.SkillBridge.skillbridge.dto.TaskResponseDto;
import com.SkillBridge.skillbridge.dto.TaskSubmissionRequestDto;
import com.SkillBridge.skillbridge.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/tasks")
public class TaskController {

    private final TaskService taskService;

    @PostMapping
    public ResponseEntity<TaskResponseDto> createTask(
            Authentication authentication,
            @Valid @RequestBody TaskCreateRequestDto request
    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(taskService.createTask(authentication, request));
    }

    @GetMapping("/exchange/{exchangeId}")
    public ResponseEntity<List<TaskResponseDto>> getExchangeTasks(
            Authentication authentication,
            @PathVariable Long exchangeId
    ) {

        return ResponseEntity.ok(
                taskService.getExchangeTasks(
                        authentication,
                        exchangeId
                )
        );
    }

    @PostMapping("/{taskId}/submit")
    public ResponseEntity<TaskResponseDto> submitTask(
            Authentication authentication,
            @PathVariable Long taskId,
            @Valid @RequestBody TaskSubmissionRequestDto request
    ) {

        return ResponseEntity.ok(
                taskService.submitTask(
                        authentication,
                        taskId,
                        request
                )
        );
    }

    @PostMapping("/{taskId}/complete")
    public ResponseEntity<TaskResponseDto> completeTask(
            Authentication authentication,
            @PathVariable Long taskId
    ) {

        return ResponseEntity.ok(
                taskService.completeTask(
                        authentication,
                        taskId
                )
        );
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TaskResponseDto>> getTasksByUser(Authentication authentication, @PathVariable Long userId
    ) {
        return ResponseEntity.ok(taskService.getTasksByUser(authentication, userId));
    }
}