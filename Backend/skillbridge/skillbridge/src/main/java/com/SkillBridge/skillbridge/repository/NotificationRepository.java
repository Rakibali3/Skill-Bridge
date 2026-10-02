package com.SkillBridge.skillbridge.repository;

import com.SkillBridge.skillbridge.entity.Notification;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface NotificationRepository
        extends JpaRepository<Notification, Long> {

    List<Notification> findByRecipient_IdOrderByCreatedAtDesc(
            Long recipientId,
            Pageable pageable
    );

    long countByRecipient_IdAndReadFalse(Long recipientId);

    Optional<Notification> findByIdAndRecipient_Id(
            Long notificationId,
            Long recipientId
    );

    @Modifying
    @Query("""
        UPDATE Notification n
        SET n.read = true
        WHERE n.recipient.id = :recipientId
          AND n.read = false
        """)
    int markAllAsRead(@Param("recipientId") Long recipientId);
}