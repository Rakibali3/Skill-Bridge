package com.SkillBridge.skillbridge.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;

import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secretKey;

    public String generateToken(String email, boolean rememberMe) {
       long expiry = getExpiry(rememberMe);
        if(rememberMe){
            expiry = 24L * 60 * 60 * 1000;
        }else{
            expiry = 10L * 60 * 1000;
        }
        return Jwts.builder()
                .subject(email)
                .issuedAt(new Date())
                .expiration(
                        new Date(System.currentTimeMillis() + expiry)
                )
                .signWith(getSecretKey())
                .compact();
    }

    public long getExpiry(boolean rememberMe) {
        if(rememberMe){
            return 24L * 60 * 60 * 1000;
        }else {
            return 10L * 60 * 1000;
        }
    }


    public String extractEmailFromToken(String token) {

        return parseToken(token)
                .getSubject();
    }


    public boolean isValidToken(String token) {

        try {

            Claims claims = parseToken(token);

            Date expiration = claims.getExpiration();

            return expiration != null
                    && expiration.after(new Date());

        } catch (Exception exception) {

            return false;
        }
    }


    private Claims parseToken(String token) {

        return Jwts.parser()
                .verifyWith(getSecretKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private SecretKey getSecretKey() {

        return Keys.hmacShaKeyFor(
                secretKey.getBytes(StandardCharsets.UTF_8)
        );
    }
}