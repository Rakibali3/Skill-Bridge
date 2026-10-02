
package com.SkillBridge.skillbridge.controller;

import com.SkillBridge.skillbridge.dto.NotificationResponseDto;
import com.SkillBridge.skillbridge.entity.User;
import com.SkillBridge.skillbridge.repository.UserRepository;
import com.SkillBridge.skillbridge.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<NotificationResponseDto>> getMyNotifications(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        User user = getAuthenticatedUser(authentication);

        return ResponseEntity.ok(
                notificationService.getMyNotifications(
                        user.getId(), page, size
                )
        );
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Long> getUnreadCount(
            Authentication authentication
    ) {
        User user = getAuthenticatedUser(authentication);

        return ResponseEntity.ok(
                notificationService.getUnreadCount(user.getId())
        );
    }

    @PatchMapping("/{notificationId}/read")
    public ResponseEntity<Void> markAsRead(
            Authentication authentication,
            @PathVariable Long notificationId
    ) {
        User user = getAuthenticatedUser(authentication);

        notificationService.markAsRead(
                user.getId(), notificationId
        );

        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead(
            Authentication authentication
    ) {
        User user = getAuthenticatedUser(authentication);

        notificationService.markAllAsRead(user.getId());

        return ResponseEntity.noContent().build();
    }

    private User getAuthenticatedUser(
            Authentication authentication
    ) {
        if (authentication == null
                || !authentication.isAuthenticated()
                || authentication.getName() == null) {
            throw new RuntimeException("User is not authenticated");
        }

        return userRepository.findByEmailIgnoreCase(
                        authentication.getName()
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Authenticated user not found"
                        )
                );
    }
}