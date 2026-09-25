package com.SkillBridge.skillbridge.repository;

import com.SkillBridge.skillbridge.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByExchangeIdOrderByCreatedAtAsc(Long exchangeId);
}