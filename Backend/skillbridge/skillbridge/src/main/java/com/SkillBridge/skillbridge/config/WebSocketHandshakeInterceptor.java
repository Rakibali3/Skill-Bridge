package com.SkillBridge.skillbridge.config;

import jakarta.servlet.http.Cookie;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Map;

public class WebSocketHandshakeInterceptor
        implements HandshakeInterceptor {

    @Override
    public boolean beforeHandshake(
            ServerHttpRequest request,
            ServerHttpResponse response,
            WebSocketHandler wsHandler,
            Map<String, Object> attributes
    ) {

        if (request instanceof ServletServerHttpRequest servletRequest) {

            Cookie[] cookies =
                    servletRequest.getServletRequest().getCookies();

            if (cookies != null) {

                for (Cookie cookie : cookies) {

                    if ("accessToken".equals(cookie.getName())) {

                        attributes.put(
                                "accessToken",
                                cookie.getValue()
                        );

                        break;
                    }
                }
            }
        }

        return true;
    }

    @Override
    public void afterHandshake(
            ServerHttpRequest request,
            ServerHttpResponse response,
            WebSocketHandler wsHandler,
            Exception exception
    ) {
        // Nothing required here
    }
}