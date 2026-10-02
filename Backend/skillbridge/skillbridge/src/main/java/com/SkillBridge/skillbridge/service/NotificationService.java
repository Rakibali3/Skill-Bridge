package com.SkillBridge.skillbridge.service;

import com.SkillBridge.skillbridge.dto.NotificationResponseDto;
import com.SkillBridge.skillbridge.entity.Notification;
import com.SkillBridge.skillbridge.entity.User;
import com.SkillBridge.skillbridge.enums.NotificationType;
import com.SkillBridge.skillbridge.repository.NotificationRepository;
import com.SkillBridge.skillbridge.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Transactional
    public void createNotification(
            Long recipientId,
            NotificationType type,
            String title,
            String message,
            String link) {

        User recipient = userRepository.findById(recipientId)
                .orElseThrow(() ->
                        new RuntimeException("Notification recipient not found"));

        Notification notification = Notification.builder()
                .recipient(recipient)
                .type(type)
                .title(title)
                .message(message)
                .link(link)
                .build();

        notificationRepository.save(notification);
    }

    @Transactional(readOnly = true)
    public List<NotificationResponseDto> getMyNotifications(
            Long recipientId,
            int page,
            int size) {

        int safePage = Math.max(page, 0);
        int safeSize = Math.min(Math.max(size, 1), 50);

        return notificationRepository
                .findByRecipient_IdOrderByCreatedAtDesc(
                        recipientId,
                        PageRequest.of(safePage, safeSize))
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public long getUnreadCount(Long recipientId) {
        return notificationRepository
                .countByRecipient_IdAndReadFalse(recipientId);
    }

    @Transactional
    public void markAsRead(Long recipientId, Long notificationId) {
        Notification notification = notificationRepository
                .findByIdAndRecipient_Id(notificationId, recipientId)
                .orElseThrow(() ->
                        new RuntimeException("Notification not found"));

        notification.setRead(true);
    }

    @Transactional
    public int markAllAsRead(Long recipientId) {
        return notificationRepository.markAllAsRead(recipientId);
    }

    private NotificationResponseDto toDto(Notification notification) {
        return NotificationResponseDto.builder()
                .id(notification.getId())
                .type(notification.getType())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .link(notification.getLink())
                .read(notification.isRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}