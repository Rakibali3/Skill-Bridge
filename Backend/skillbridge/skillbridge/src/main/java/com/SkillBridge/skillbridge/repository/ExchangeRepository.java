package com.SkillBridge.skillbridge.repository;

import com.SkillBridge.skillbridge.entity.Exchange;
import com.SkillBridge.skillbridge.enums.ExchangeStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ExchangeRepository extends JpaRepository<Exchange, Long> {
    Optional<Exchange> findByUser1IdAndUser2Id(Long user1Id, Long user2Id);

    boolean existsByUser1IdAndUser2IdAndStatus(
            Long user1Id,
            Long user2Id,
            ExchangeStatus status
    );

    List<Exchange> findByUser1IdOrUser2IdOrderByCreatedAtDesc(
            Long user1Id,
            Long user2Id
    );
}