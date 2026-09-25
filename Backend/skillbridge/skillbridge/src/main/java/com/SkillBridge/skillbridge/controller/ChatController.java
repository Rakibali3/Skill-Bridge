package com.SkillBridge.skillbridge.controller;

import com.SkillBridge.skillbridge.dto.ChatMessageResponseDto;
import com.SkillBridge.skillbridge.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/chat")
public class ChatController {

    private final ChatService chatService;

    @GetMapping("/exchange/{exchangeId}")
    public ResponseEntity<List<ChatMessageResponseDto>> getMessages(
            Authentication authentication,
            @PathVariable Long exchangeId
    ) {

        return ResponseEntity.ok(
                chatService.getMessages(
                        authentication,
                        exchangeId
                )
        );
    }
}