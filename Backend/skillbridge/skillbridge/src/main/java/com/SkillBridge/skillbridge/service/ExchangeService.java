package com.SkillBridge.skillbridge.service;

import com.SkillBridge.skillbridge.ExceptionHandling.AuthenticatedUserNotFoundException;
import com.SkillBridge.skillbridge.dto.ExchangeCreateRequestDto;
import com.SkillBridge.skillbridge.dto.ExchangeResponseDto;
import com.SkillBridge.skillbridge.dto.ExchangeSkillResponseDto;
import com.SkillBridge.skillbridge.entity.*;
import com.SkillBridge.skillbridge.enums.*;
import com.SkillBridge.skillbridge.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ExchangeService {

    private final ExchangeRepository exchangeRepository;
    private final ExchangeSkillRepository exchangeSkillRepository;
    private final ExchangeRequestRepository exchangeRequestRepository;
    private final UserRepository userRepository;
    private final UserSkillRepository userSkillRepository;
    private final UserProfileRepository userProfileRepository;
    private final TaskRepository taskRepository;

    public ExchangeResponseDto createExchange(
            Authentication authentication,
            ExchangeCreateRequestDto request
    ) {

        User currentUser = getAuthenticatedUser(authentication);

        User partner = userRepository.findById(request.getPartnerId())
                .orElseThrow(() -> new RuntimeException("Partner not found"));

        if (currentUser.getId().equals(partner.getId())) {
            throw new RuntimeException("You cannot create an exchange with yourself");
        }


        if (!areConnected(currentUser.getId(), partner.getId())) {
            throw new RuntimeException(
                    "You can start an exchange only with a connected user"
            );
        }

        User user1;
        User user2;

        if (currentUser.getId() < partner.getId()) {
            user1 = currentUser;
            user2 = partner;
        } else {
            user1 = partner;
            user2 = currentUser;
        }

        boolean exchangeExists =
                exchangeRepository.existsByUser1IdAndUser2IdAndStatus(
                        user1.getId(),
                        user2.getId(),
                        ExchangeStatus.ACTIVE
                );

        if (exchangeExists) {
            throw new RuntimeException(
                    "An active exchange already exists between these users"
            );
        }

        /*
         * Validate current user's selected skills.
         */
        UserSkill myTeachingSkill = getUserSkill(
                request.getMyTeachingSkillId(),
                currentUser.getId()
        );

        UserSkill myLearningSkill = getUserSkill(
                request.getMyLearningSkillId(),
                currentUser.getId()
        );

        /*
         * Validate partner's selected skills.
         */
        UserSkill partnerTeachingSkill = getUserSkill(
                request.getPartnerTeachingSkillId(),
                partner.getId()
        );

        UserSkill partnerLearningSkill = getUserSkill(
                request.getPartnerLearningSkillId(),
                partner.getId()
        );

        /*
         * Validate skill directions.
         */
        validateSkillType(
                myTeachingSkill,
                SkillType.TEACH,
                "Your teaching skill must be a TEACH skill"
        );

        validateSkillType(
                myLearningSkill,
                SkillType.LEARN,
                "Your learning skill must be a LEARN skill"
        );

        validateSkillType(
                partnerTeachingSkill,
                SkillType.TEACH,
                "Partner teaching skill must be a TEACH skill"
        );

        validateSkillType(
                partnerLearningSkill,
                SkillType.LEARN,
                "Partner learning skill must be a LEARN skill"
        );

        /*
         * Create the exchange.
         */
        Exchange exchange = Exchange.builder()
                .user1(user1)
                .user2(user2)
                .status(ExchangeStatus.ACTIVE)
                .build();

        Exchange savedExchange = exchangeRepository.save(exchange);

        /*
         * Create the four skill relationships.
         */
        createExchangeSkill(
                savedExchange,
                currentUser,
                myTeachingSkill.getSkill(),
                ExchangeSkillDirection.TEACH
        );

        createExchangeSkill(
                savedExchange,
                currentUser,
                myLearningSkill.getSkill(),
                ExchangeSkillDirection.LEARN
        );

        createExchangeSkill(
                savedExchange,
                partner,
                partnerTeachingSkill.getSkill(),
                ExchangeSkillDirection.TEACH
        );

        createExchangeSkill(
                savedExchange,
                partner,
                partnerLearningSkill.getSkill(),
                ExchangeSkillDirection.LEARN
        );

        return convertToResponse(savedExchange);
    }

    @Transactional(readOnly = true)
    public List<ExchangeResponseDto> getMyExchanges(
            Authentication authentication
    ) {

        User user = getAuthenticatedUser(authentication);

        return exchangeRepository
                .findByUser1IdOrUser2IdOrderByCreatedAtDesc(
                        user.getId(),
                        user.getId()
                )
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ExchangeResponseDto getExchange(
            Authentication authentication,
            Long exchangeId
    ) {

        User user = getAuthenticatedUser(authentication);

        Exchange exchange = exchangeRepository.findById(exchangeId)
                .orElseThrow(() -> new RuntimeException("Exchange not found"));

        if (!isParticipant(exchange, user.getId())) {
            throw new RuntimeException("You are not a participant in this exchange");
        }

        return convertToResponse(exchange);
    }

    @Transactional
    public ExchangeResponseDto confirmCompletion(Authentication authentication, Long exchangeId) {
        User currentUser = getAuthenticatedUser(authentication);
        Long userId = currentUser.getId();

        Exchange exchange = exchangeRepository.findById(exchangeId)
                .orElseThrow(() -> new RuntimeException("Exchange not found"));

        if (!isParticipant(exchange, userId)) {
            throw new RuntimeException("You are not a participant in this exchange");
        }

        if (exchange.getStatus() != ExchangeStatus.ACTIVE) {
            throw new RuntimeException("Only active exchanges can be completed");
        }

        List<Task> tasks = taskRepository.findByExchangeIdAndAssignedToId(exchangeId, userId);

        boolean hasIncompleteTasks = tasks.stream().anyMatch(task -> task.getStatus() != TaskStatus.COMPLETED);

        if (hasIncompleteTasks) {
            throw new RuntimeException("You cannot confirm completion while you have incomplete tasks");
        }

        if (exchange.getUser1().getId().equals(userId)) {
            exchange.setUser1CompletionConfirmed(true);
        } else {
            exchange.setUser2CompletionConfirmed(true);
        }

        if (exchange.isUser1CompletionConfirmed()
                && exchange.isUser2CompletionConfirmed()) {

            exchange.setStatus(ExchangeStatus.COMPLETED);
            exchange.setCompletedAt(LocalDateTime.now());
        }

        Exchange savedExchange = exchangeRepository.save(exchange);

        return convertToResponse(savedExchange);
    }

    private boolean areConnected(Long userId1, Long userId2) {

        return isAcceptedConnection(userId1, userId2)
                || isAcceptedConnection(userId2, userId1);
    }

    private boolean isAcceptedConnection(Long senderId, Long receiverId) {

        return exchangeRequestRepository
                .findBySenderIdAndReceiverId(senderId, receiverId)
                .map(request ->
                        request.getStatus() == ExchangeRequestStatus.ACCEPTED
                )
                .orElse(false);
    }

    private UserSkill getUserSkill(Long userSkillId, Long userId) {
        return userSkillRepository.findByIdAndUserId(userSkillId, userId)
                .orElseThrow(() -> new RuntimeException("Selected skill does not belong to the user"));
    }

    private void validateSkillType(UserSkill userSkill, SkillType expectedType, String message) {
        if (userSkill.getSkillType() != expectedType) {
            throw new RuntimeException(message);
        }
    }

    private void createExchangeSkill(
            Exchange exchange,
            User user,
            Skill skill,
            ExchangeSkillDirection direction
    ) {

        ExchangeSkill exchangeSkill = ExchangeSkill.builder()
                .exchange(exchange)
                .user(user)
                .skill(skill)
                .direction(direction)
                .build();

        exchangeSkillRepository.save(exchangeSkill);
    }

    private boolean isParticipant(Exchange exchange, Long userId) {

        return exchange.getUser1().getId().equals(userId)
                || exchange.getUser2().getId().equals(userId);
    }

    private ExchangeResponseDto convertToResponse(Exchange exchange) {

        List<ExchangeSkillResponseDto> skills =
                exchangeSkillRepository
                        .findByExchangeId(exchange.getId())
                        .stream()
                        .map(exchangeSkill ->
                                ExchangeSkillResponseDto.builder()
                                        .userId(exchangeSkill.getUser().getId())
                                        .skillId(exchangeSkill.getSkill().getId())
                                        .skillName(exchangeSkill.getSkill().getName())
                                        .direction(exchangeSkill.getDirection())
                                        .build()
                        )
                        .toList();

        return ExchangeResponseDto.builder()
                .id(exchange.getId())
                .user1Id(exchange.getUser1().getId())
                .user1Name(exchange.getUser1().getUserName())
                .user1AvatarUrl(getAvatarUrl(exchange.getUser1().getId()))
                .user2Id(exchange.getUser2().getId())
                .user2Name(exchange.getUser2().getUserName())
                .user2AvatarUrl(getAvatarUrl(exchange.getUser2().getId()))
                .status(exchange.getStatus())
                .createdAt(exchange.getCreatedAt())
                .user1CompletionConfirmed(exchange.isUser1CompletionConfirmed())
                .user2CompletionConfirmed(exchange.isUser2CompletionConfirmed())
                .completedAt(exchange.getCompletedAt())
                .skills(skills)
                .build();
    }

    private String getAvatarUrl(Long id) {
        return userProfileRepository
                .findByUserId(id)
                .map(UserProfile::getAvatarUrl)
                .orElse(null);
    }

    private User getAuthenticatedUser(
            Authentication authentication
    ) {

        String email = authentication.getName();

        return userRepository
                .findByEmailIgnoreCase(email)
                .orElseThrow(() ->
                        new AuthenticatedUserNotFoundException(
                                "Authenticated user not found"
                        )
                );
    }

}