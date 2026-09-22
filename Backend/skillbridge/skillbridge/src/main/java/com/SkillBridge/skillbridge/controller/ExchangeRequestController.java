package com.SkillBridge.skillbridge.controller;

import com.SkillBridge.skillbridge.dto.ExchangeRequestDto;
import com.SkillBridge.skillbridge.dto.ExchangeRequestResponseDto;
import com.SkillBridge.skillbridge.service.ExchangeRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/exchange-requests")
public class ExchangeRequestController {

    private final ExchangeRequestService exchangeRequestService;

    @PostMapping
    public ResponseEntity<ExchangeRequestResponseDto> sendRequest(
            Authentication authentication,
            @Valid @RequestBody ExchangeRequestDto request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(exchangeRequestService.sendRequest(authentication, request));
    }

    @GetMapping("/received")
    public List<ExchangeRequestResponseDto> getReceivedRequests(Authentication authentication) {
        return exchangeRequestService.getReceivedRequests(authentication);
    }

    @GetMapping("/sent")
    public List<ExchangeRequestResponseDto> getSentRequests(Authentication authentication) {
        return exchangeRequestService.getSentRequests(authentication);
    }

    @PostMapping("/{requestId}/accept")
    public ResponseEntity<ExchangeRequestResponseDto> acceptRequest(Authentication authentication,
            @PathVariable Long requestId
    ) {
        return ResponseEntity.ok(exchangeRequestService.acceptRequest(authentication, requestId));
    }

    @PostMapping("/{requestId}/reject")
    public ResponseEntity<ExchangeRequestResponseDto> rejectRequest(Authentication authentication,
            @PathVariable Long requestId
    ) {
        return ResponseEntity.ok(exchangeRequestService.rejectRequest(authentication, requestId));
    }
}
