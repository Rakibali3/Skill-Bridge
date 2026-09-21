package com.SkillBridge.skillbridge.controller;

import com.SkillBridge.skillbridge.dto.*;

import com.SkillBridge.skillbridge.entity.User;

import com.SkillBridge.skillbridge.repository.UserRepository;
import com.SkillBridge.skillbridge.security.CookieService;
import com.SkillBridge.skillbridge.security.JwtService;
import com.SkillBridge.skillbridge.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController

@RequiredArgsConstructor

public class UserController {

    private final UserService userService;
    private final JwtService jwtService;
    private final CookieService cookieService;

    @PostMapping("/signup")
    public ResponseEntity<SignupResponseDto> signup(@Valid @RequestBody SignupRequestDto request) {

        User newUser = userService.signup(request);

        SignupResponseDto response =
                new SignupResponseDto(
                        "Account created successfully",
                        newUser.getId(),
                        newUser.getUserName(),
                        newUser.getEmail()
                );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@Valid @RequestBody LoginRequestDto request, HttpServletResponse response) {
        LoginResponseDto existingUser = userService.login(request);
        String token = jwtService.generateToken(existingUser.getEmail(),existingUser.getRole().name(), request.isRememberMe());
        long expiry = jwtService.getExpiry(request.isRememberMe());
        response.addHeader(HttpHeaders.SET_COOKIE,
                cookieService.createAccessTokenCookie(token, expiry).toString());
        return ResponseEntity.ok(existingUser);
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(HttpServletResponse response) {

        response.addHeader(HttpHeaders.SET_COOKIE,
                cookieService.deleteAccessTokenCookie().toString());

        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }

    @GetMapping("/authenticated")
    public ResponseEntity<?> isAuthenticated(Authentication authentication) {
        User user =  userService.isAuthenticated(authentication);
        return ResponseEntity.ok(user.getEmail());
    }


}