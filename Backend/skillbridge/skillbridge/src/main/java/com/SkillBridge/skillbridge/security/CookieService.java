package com.SkillBridge.skillbridge.security;

import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
public class CookieService {

    private static final String ACCESS_TOKEN = "accessToken";

    public ResponseCookie createAccessTokenCookie(String token, long expiry) {

        return ResponseCookie
                .from(ACCESS_TOKEN, token)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(Duration.ofMillis(expiry))
                .sameSite("None")
                .build();
    }

    public ResponseCookie deleteAccessTokenCookie() {

        return ResponseCookie
                .from(ACCESS_TOKEN, "")
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(Duration.ZERO)
                .sameSite("None")
                .build();
    }
}