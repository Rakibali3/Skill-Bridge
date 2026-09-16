package com.SkillBridge.skillbridge.controller;

import com.SkillBridge.skillbridge.dto.LoginRequestDto;
import com.SkillBridge.skillbridge.dto.LoginResponseDto;
import com.SkillBridge.skillbridge.dto.SignupRequestDto;
import com.SkillBridge.skillbridge.dto.SignupResponseDto;

import com.SkillBridge.skillbridge.entity.User;

import com.SkillBridge.skillbridge.security.JwtService;
import com.SkillBridge.skillbridge.service.UserService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController

@RequiredArgsConstructor

public class UserController {

    private final UserService userService;
    private final JwtService jwtService;

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
    public ResponseEntity<LoginResponseDto> login(@Valid @RequestBody LoginRequestDto request){
        LoginResponseDto existingUser =  userService.login(request);
        String token = jwtService.generateToken(existingUser.getEmail(),request.isRememberMe());
        ResponseCookie responseCookie = ResponseCookie.from("accessToken", token)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(jwtService.getExpiry(request.isRememberMe())/1000)
                .sameSite("Lax")
                .build();
        existingUser.setToken(token);
       return ResponseEntity.ok().header("Set-Cookie",responseCookie.toString())
               .body(existingUser);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {

        ResponseCookie responseCookie =
                ResponseCookie.from("accessToken", "")
                        .httpOnly(true)
                        .secure(false)
                        .path("/")
                        .maxAge(0)
                        .sameSite("Lax")
                        .build();

        return ResponseEntity.ok()
                .header("Set-Cookie", responseCookie.toString())
                .body("Logged out successfully");
    }
}