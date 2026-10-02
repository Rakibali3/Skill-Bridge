package com.SkillBridge.skillbridge.service;

import com.SkillBridge.skillbridge.dto.TaskCreateRequestDto;
import com.SkillBridge.skillbridge.dto.TaskResponseDto;
import com.SkillBridge.skillbridge.dto.TaskSubmissionRequestDto;
import com.SkillBridge.skillbridge.entity.Exchange;
import com.SkillBridge.skillbridge.entity.Task;
import com.SkillBridge.skillbridge.entity.User;
import com.SkillBridge.skillbridge.enums.ExchangeStatus;
import com.SkillBridge.skillbridge.enums.NotificationType;
import com.SkillBridge.skillbridge.enums.TaskStatus;
import com.SkillBridge.skillbridge.repository.ExchangeRepository;
import com.SkillBridge.skillbridge.repository.TaskRepository;
import com.SkillBridge.skillbridge.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final ExchangeRepository exchangeRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Transactional
    public TaskResponseDto createTask(
            Authentication authentication,
            TaskCreateRequestDto request
    ) {

        User currentUser = getAuthenticatedUser(authentication);

        Exchange exchange = exchangeRepository.findById(request.getExchangeId())
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Exchange not found"));

        validateExchangeAccess(exchange, currentUser);

        if (exchange.getStatus() != ExchangeStatus.ACTIVE) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Tasks can only be created for an active exchange");
        }

        User assignedUser = userRepository.findById(request.getAssignedToId())
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Assigned user not found"));

        validateExchangeParticipant(exchange, assignedUser);

        if (assignedUser.getId().equals(currentUser.getId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "You cannot assign a task to yourself");
        }

        Task task = Task.builder()
                .exchange(exchange)
                .createdBy(currentUser)
                .assignedTo(assignedUser)
                .title(request.getTitle().trim())
                .description(
                        request.getDescription() == null
                                ? null
                                : request.getDescription().trim()
                )
                .status(TaskStatus.PENDING)
                .build();

        Task savedTask = taskRepository.save(task);
        String notificationLink = "/exchanges/" + savedTask.getExchange().getId();
        notificationService.createNotification(
                assignedUser.getId(),
                NotificationType.TASK_ASSIGNED,
                "New task assigned",
                currentUser.getUserName()
                        + " assigned you a task: "
                        + savedTask.getTitle(),
                notificationLink
        );

        return convertToResponse(savedTask);
    }

    @Transactional(readOnly = true)
    public List<TaskResponseDto> getExchangeTasks(
            Authentication authentication,
            Long exchangeId
    ) {

        User currentUser = getAuthenticatedUser(authentication);

        Exchange exchange = exchangeRepository.findById(exchangeId)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Exchange not found"));

        validateExchangeAccess(exchange, currentUser);

        return taskRepository
                .findByExchangeIdOrderByCreatedAtDesc(exchangeId)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Transactional
    public TaskResponseDto submitTask(
            Authentication authentication,
            Long taskId,
            TaskSubmissionRequestDto request
    ) {

        User currentUser = getAuthenticatedUser(authentication);

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found"));

        if (!task.getAssignedTo().getId().equals(currentUser.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only the assigned user can submit this task");
        }

        if (task.getStatus() != TaskStatus.PENDING) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "This task cannot be submitted");
        }

        boolean hasGithubUrl =
                request.getGithubUrl() != null &&
                        !request.getGithubUrl().isBlank();

        boolean hasFile =
                request.getSubmittedFileUrl() != null &&
                        !request.getSubmittedFileUrl().isBlank();

        if (!hasGithubUrl && !hasFile) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Please provide a GitHub URL or upload a file");
        }

        task.setGithubUrl(
                hasGithubUrl ? request.getGithubUrl().trim() : null
        );

        task.setSubmittedFileUrl(
                hasFile
                        ? request.getSubmittedFileUrl().trim()
                        : null
        );

        task.setSubmittedFileName(
                hasFile
                        ? request.getSubmittedFileName()
                        : null
        );

        task.setStatus(TaskStatus.SUBMITTED);
        task.setSubmittedAt(LocalDateTime.now());

        Task savedTask = taskRepository.save(task);
        String notificationLink = "/exchanges/" + savedTask.getExchange().getId();
        notificationService.createNotification(
                task.getCreatedBy().getId(),
                NotificationType.TASK_SUBMITTED,
                "Task submitted for review",
                currentUser.getUserName()
                        + " submitted the task: "
                        + savedTask.getTitle(),
                notificationLink
        );

        return convertToResponse(savedTask);
    }

    @Transactional
    public TaskResponseDto completeTask(Authentication authentication, Long taskId) {

        User currentUser = getAuthenticatedUser(authentication);

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found"));

        // Task creator reviews the submission
        if (!task.getCreatedBy().getId().equals(currentUser.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only the task creator can complete this task");
        }

        if (task.getStatus() != TaskStatus.SUBMITTED) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only submitted tasks can be completed");
        }

        task.setStatus(TaskStatus.COMPLETED);
        task.setCompletedAt(LocalDateTime.now());

        Task savedTask = taskRepository.save(task);
        String notificationLink = "/exchanges/" + savedTask.getExchange().getId();
        notificationService.createNotification(
                task.getAssignedTo().getId(),
                NotificationType.TASK_COMPLETED,
                "Task completed",
                currentUser.getUserName()
                        + " marked your task as completed: "
                        + savedTask.getTitle(),
                notificationLink
        );

        return convertToResponse(savedTask);
    }

    @Transactional(readOnly = true)
    public List<TaskResponseDto> getTasksByUser(Authentication authentication, Long userId) {
        User currentUser = getAuthenticatedUser(authentication);

        if (!currentUser.getId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not allowed to access another user's tasks");
        }

        List<Task> tasks = taskRepository.findByAssignedToId(userId);

        return tasks.stream()
                .map(this::convertToResponse)
                .toList();
    }

    private User getAuthenticatedUser(
            Authentication authentication
    ) {

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User is not authenticated");
        }

        return userRepository.findByEmailIgnoreCase(
                        authentication.getName()
                )
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Authenticated user not found"));
    }

    private void validateExchangeAccess(
            Exchange exchange,
            User user
    ) {

        boolean isParticipant =
                exchange.getUser1().getId().equals(user.getId()) ||
                        exchange.getUser2().getId().equals(user.getId());

        if (!isParticipant) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not part of this exchange");
        }
    }

    private void validateExchangeParticipant(
            Exchange exchange,
            User user
    ) {

        boolean isParticipant =
                exchange.getUser1().getId().equals(user.getId()) ||
                        exchange.getUser2().getId().equals(user.getId());

        if (!isParticipant) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Assigned user is not part of this exchange");
        }
    }

    private TaskResponseDto convertToResponse(Task task) {

        return TaskResponseDto.builder()
                .id(task.getId())
                .exchangeId(task.getExchange().getId())

                .createdById(task.getCreatedBy().getId())
                .createdByName(task.getCreatedBy().getUserName())

                .assignedToId(task.getAssignedTo().getId())
                .assignedToName(task.getAssignedTo().getUserName())

                .title(task.getTitle())
                .description(task.getDescription())

                .status(task.getStatus())

                .githubUrl(task.getGithubUrl())
                .submittedFileUrl(task.getSubmittedFileUrl())
                .submittedFileName(task.getSubmittedFileName())

                .createdAt(task.getCreatedAt())
                .submittedAt(task.getSubmittedAt())
                .completedAt(task.getCompletedAt())

                .build();
    }


}