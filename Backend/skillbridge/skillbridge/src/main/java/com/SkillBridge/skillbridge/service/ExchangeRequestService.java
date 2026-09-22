package com.SkillBridge.skillbridge.service;

import com.SkillBridge.skillbridge.ExceptionHandling.AuthenticatedUserNotFoundException;
import com.SkillBridge.skillbridge.dto.ExchangeRequestDto;
import com.SkillBridge.skillbridge.dto.ExchangeRequestResponseDto;
import com.SkillBridge.skillbridge.entity.ExchangeRequest;
import com.SkillBridge.skillbridge.entity.User;
import com.SkillBridge.skillbridge.enums.ExchangeRequestStatus;
import com.SkillBridge.skillbridge.repository.ExchangeRequestRepository;
import com.SkillBridge.skillbridge.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ExchangeRequestService {

    private final ExchangeRequestRepository exchangeRequestRepository;
    private final UserRepository userRepository;

    public ExchangeRequestResponseDto sendRequest(Authentication authentication, ExchangeRequestDto request) {

        User sender = getAuthenticatedUser(authentication);

        User receiver = userRepository.findById(request.getReceiverId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Prevent sending request to yourself
        if (sender.getId().equals(receiver.getId())) {
            throw new RuntimeException("You cannot send a request to yourself");
        }

        boolean alreadyPending = exchangeRequestRepository
                        .existsBySenderIdAndReceiverIdAndStatus(
                                sender.getId(),
                                receiver.getId(),
                                ExchangeRequestStatus.PENDING
                        );

        if (alreadyPending) {
            throw new RuntimeException("You have already sent a request to this user");
        }

        ExchangeRequest exchangeRequest = exchangeRequestRepository
                        .findBySenderIdAndReceiverId(sender.getId(), receiver.getId()).orElse(
                                ExchangeRequest.builder()
                                        .sender(sender)
                                        .receiver(receiver)
                                        .build()
                        );

        exchangeRequest.setStatus(ExchangeRequestStatus.PENDING);

        ExchangeRequest saved = exchangeRequestRepository.save(exchangeRequest);

        return convertToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<ExchangeRequestResponseDto> getReceivedRequests(Authentication authentication) {

        User user = getAuthenticatedUser(authentication);

        return exchangeRequestRepository
                .findByReceiverIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ExchangeRequestResponseDto> getSentRequests(Authentication authentication) {

        User user = getAuthenticatedUser(authentication);

        return exchangeRequestRepository
                .findBySenderIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    public ExchangeRequestResponseDto acceptRequest(Authentication authentication, Long requestId) {

        User receiver = getAuthenticatedUser(authentication);

        ExchangeRequest request = exchangeRequestRepository
                .findByIdAndReceiverId(requestId, receiver.getId())
                .orElseThrow(() -> new RuntimeException("Exchange request not found"));

        if (request.getStatus() != ExchangeRequestStatus.PENDING) {
            throw new RuntimeException("Only pending requests can be accepted");
        }

        request.setStatus(ExchangeRequestStatus.ACCEPTED);

        ExchangeRequest updated = exchangeRequestRepository.save(request);

        return convertToResponse(updated);
    }

    public ExchangeRequestResponseDto rejectRequest(Authentication authentication, Long requestId) {

        User receiver = getAuthenticatedUser(authentication);

        ExchangeRequest request = exchangeRequestRepository
                .findByIdAndReceiverId(requestId, receiver.getId())
                .orElseThrow(() -> new RuntimeException("Exchange request not found"));

        if (request.getStatus() != ExchangeRequestStatus.PENDING) {
            throw new RuntimeException("Only pending requests can be rejected");
        }

        request.setStatus(ExchangeRequestStatus.REJECTED);

        ExchangeRequest updated = exchangeRequestRepository.save(request);

        return convertToResponse(updated);
    }

    private ExchangeRequestResponseDto convertToResponse(ExchangeRequest request) {

        return ExchangeRequestResponseDto.builder()
                .id(request.getId())
                .senderId(request.getSender().getId())
                .senderName(request.getSender().getUserName())
                .receiverId(request.getReceiver().getId())
                .receiverName(request.getReceiver().getUserName())
                .status(request.getStatus())
                .createdAt(request.getCreatedAt())
                .build();
    }

    private User getAuthenticatedUser(Authentication authentication) {

        String email = authentication.getName();

        return userRepository
                .findByEmailIgnoreCase(email)
                .orElseThrow(() -> new AuthenticatedUserNotFoundException("Authenticated user not found"));
    }
}