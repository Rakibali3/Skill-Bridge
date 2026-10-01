package com.SkillBridge.skillbridge.controller;

import com.SkillBridge.skillbridge.dto.ExchangeCreateRequestDto;
import com.SkillBridge.skillbridge.dto.ExchangeResponseDto;
import com.SkillBridge.skillbridge.service.ExchangeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/exchanges")
public class ExchangeController {

    private final ExchangeService exchangeService;

    @PostMapping
    public ResponseEntity<ExchangeResponseDto> createExchange(
            Authentication authentication,
            @Valid @RequestBody ExchangeCreateRequestDto request
    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        exchangeService.createExchange(
                                authentication,
                                request
                        )
                );
    }

    @GetMapping
    public ResponseEntity<List<ExchangeResponseDto>> getMyExchanges(
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                exchangeService.getMyExchanges(authentication)
        );
    }

    @GetMapping("/{exchangeId}")
    public ResponseEntity<ExchangeResponseDto> getExchange(Authentication authentication, @PathVariable Long exchangeId
    ) {
        return ResponseEntity.ok(exchangeService.getExchange(authentication, exchangeId));
    }

    @PostMapping("/{exchangeId}/complete")
    public ResponseEntity<ExchangeResponseDto> confirmCompletion(Authentication authentication,@PathVariable Long exchangeId
    ) {
        return ResponseEntity.ok(exchangeService.confirmCompletion(authentication, exchangeId));
    }
}