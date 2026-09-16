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
                .secure(false) // true in production with HTTPS
                .path("/")
                .maxAge(Duration.ofMillis(expiry))
                .sameSite("Lax")
                .build();
    }

    public ResponseCookie deleteAccessTokenCookie() {

        return ResponseCookie
                .from(ACCESS_TOKEN, "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(Duration.ZERO)
                .sameSite("Lax")
                .build();
    }
}