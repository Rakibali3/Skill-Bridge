package com.SkillBridge.skillbridge.config;

import com.SkillBridge.skillbridge.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Component;

import java.util.Collections;

@Component
@RequiredArgsConstructor
public class WebSocketAuthInterceptor
        implements ChannelInterceptor {

    private final JwtService jwtService;

    @Override
    public Message<?> preSend(
            Message<?> message,
            MessageChannel channel
    ) {

        StompHeaderAccessor accessor =
                StompHeaderAccessor.wrap(message);

        if (StompCommand.CONNECT.equals(accessor.getCommand())) {

            String token = null;

            if (accessor.getSessionAttributes() != null) {

                token = (String) accessor
                        .getSessionAttributes()
                        .get("accessToken");
            }

            if (token != null &&
                    jwtService.isValidToken(token)) {

                String email =
                        jwtService.extractEmailFromToken(token);

                String role =
                        jwtService.extractRoleFromToken(token);

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                email,
                                null,
                                Collections.emptyList()
                        );

                accessor.setUser(authentication);
            }
        }

        return message;
    }
}