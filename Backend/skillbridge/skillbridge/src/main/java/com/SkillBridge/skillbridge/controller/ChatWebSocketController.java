package com.SkillBridge.skillbridge.controller;

import com.SkillBridge.skillbridge.dto.ChatMessageRequestDto;
import com.SkillBridge.skillbridge.dto.ChatMessageResponseDto;
import com.SkillBridge.skillbridge.service.ChatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class ChatWebSocketController {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat.send")
    public void sendMessage(
            Authentication authentication,
            @Valid ChatMessageRequestDto request
    ) {

        ChatMessageResponseDto response =
                chatService.sendMessage(
                        authentication,
                        request.getExchangeId(),
                        request.getMessage()
                );

        messagingTemplate.convertAndSend(
                "/topic/exchange/" + request.getExchangeId(),
                response
        );
    }
}