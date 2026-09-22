package com.SkillBridge.skillbridge.repository;

import com.SkillBridge.skillbridge.entity.ExchangeRequest;
import com.SkillBridge.skillbridge.enums.ExchangeRequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ExchangeRequestRepository
        extends JpaRepository<ExchangeRequest, Long> {

    boolean existsBySenderIdAndReceiverIdAndStatus(
            Long senderId,
            Long receiverId,
            ExchangeRequestStatus status
    );

    Optional<ExchangeRequest> findBySenderIdAndReceiverId(
            Long senderId,
            Long receiverId
    );

    List<ExchangeRequest> findByReceiverIdOrderByCreatedAtDesc(
            Long receiverId
    );

    List<ExchangeRequest> findBySenderIdOrderByCreatedAtDesc(
            Long senderId
    );

    Optional<ExchangeRequest> findByIdAndReceiverId(
            Long id,
            Long receiverId
    );
}