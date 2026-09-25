package com.SkillBridge.skillbridge.service;

import com.SkillBridge.skillbridge.dto.ChatMessageResponseDto;
import com.SkillBridge.skillbridge.entity.ChatMessage;
import com.SkillBridge.skillbridge.entity.Exchange;
import com.SkillBridge.skillbridge.entity.User;
import com.SkillBridge.skillbridge.repository.ChatMessageRepository;
import com.SkillBridge.skillbridge.repository.ExchangeRepository;
import com.SkillBridge.skillbridge.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;
    private final ExchangeRepository exchangeRepository;
    private final UserRepository userRepository;

    @Transactional
    public ChatMessageResponseDto sendMessage(
            Authentication authentication,
            Long exchangeId,
            String message
    ) {

        User sender = getAuthenticatedUser(authentication);

        Exchange exchange = exchangeRepository.findById(exchangeId)
                .orElseThrow(() ->
                        new RuntimeException("Exchange not found")
                );

        // Only exchange participants can send messages
        if (!isParticipant(exchange, sender.getId())) {
            throw new RuntimeException(
                    "You are not a participant of this exchange"
            );
        }

        if (exchange.getStatus() !=
                com.SkillBridge.skillbridge.enums.ExchangeStatus.ACTIVE) {

            throw new RuntimeException(
                    "Chat is available only for active exchanges"
            );
        }

        String cleanedMessage = message == null
                ? ""
                : message.trim();

        if (cleanedMessage.isEmpty()) {
            throw new RuntimeException(
                    "Message cannot be empty"
            );
        }

        if (cleanedMessage.length() > 2000) {
            throw new RuntimeException(
                    "Message cannot exceed 2000 characters"
            );
        }

        ChatMessage chatMessage = ChatMessage.builder()
                .exchange(exchange)
                .sender(sender)
                .message(cleanedMessage)
                .build();

        ChatMessage savedMessage =
                chatMessageRepository.save(chatMessage);

        return convertToResponse(savedMessage);
    }


    @Transactional(readOnly = true)
    public List<ChatMessageResponseDto> getMessages(
            Authentication authentication,
            Long exchangeId
    ) {

        User user = getAuthenticatedUser(authentication);

        Exchange exchange = exchangeRepository.findById(exchangeId)
                .orElseThrow(() ->
                        new RuntimeException("Exchange not found")
                );

        if (!isParticipant(exchange, user.getId())) {
            throw new RuntimeException(
                    "You are not a participant of this exchange"
            );
        }

        return chatMessageRepository
                .findByExchangeIdOrderByCreatedAtAsc(exchangeId)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }


    private boolean isParticipant(
            Exchange exchange,
            Long userId
    ) {

        return exchange.getUser1().getId().equals(userId)
                || exchange.getUser2().getId().equals(userId);
    }


    private User getAuthenticatedUser(
            Authentication authentication
    ) {

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            throw new RuntimeException(
                    "User is not authenticated"
            );
        }

        String email = authentication.getName();

        return userRepository
                .findByEmailIgnoreCase(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );
    }


    private ChatMessageResponseDto convertToResponse(
            ChatMessage chatMessage
    ) {

        return ChatMessageResponseDto.builder()
                .id(chatMessage.getId())
                .exchangeId(
                        chatMessage.getExchange().getId()
                )
                .senderId(
                        chatMessage.getSender().getId()
                )
                .senderName(
                        chatMessage.getSender().getUserName()
                )
                .message(chatMessage.getMessage())
                .status(chatMessage.getStatus())
                .createdAt(chatMessage.getCreatedAt())
                .build();
    }
}