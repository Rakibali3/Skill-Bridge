package com.SkillBridge.skillbridge.service;

import com.SkillBridge.skillbridge.ExceptionHandling.AuthenticatedUserNotFoundException;
import com.SkillBridge.skillbridge.ExceptionHandling.EmailAlreadyExistsException;
import com.SkillBridge.skillbridge.ExceptionHandling.InvalidCredentialsException;
import com.SkillBridge.skillbridge.dto.LoginRequestDto;
import com.SkillBridge.skillbridge.dto.LoginResponseDto;
import com.SkillBridge.skillbridge.dto.ProfileResponseDto;
import com.SkillBridge.skillbridge.dto.SignupRequestDto;
import com.SkillBridge.skillbridge.entity.User;
import com.SkillBridge.skillbridge.entity.UserProfile;
import com.SkillBridge.skillbridge.enums.Roles;
import com.SkillBridge.skillbridge.repository.UserProfileRepository;
import com.SkillBridge.skillbridge.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.stereotype.Service;

import java.util.Locale;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserProfileRepository userProfileRepository;

    public User signup(SignupRequestDto request) {

        String userName =
                request.getUserName().trim();


        String email =
                request.getEmail()
                        .trim()
                        .toLowerCase(Locale.ROOT);

        if (userRepository.existsByEmailIgnoreCase(email)) {

            throw new EmailAlreadyExistsException(
                    "An account with this email already exists"
            );
        }

        User user = User.builder()
                .userName(userName)
                .email(email)
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Roles.USER)
                .build();


        return userRepository.save(user);
    }

    public LoginResponseDto login(LoginRequestDto request) {
        String email = request.getEmail()
                        .trim()
                        .toLowerCase(Locale.ROOT);
        User user = userRepository.findByEmailIgnoreCase(email).
                orElseThrow(() -> new InvalidCredentialsException( "Email does not exist please signup!"));
        boolean passwordMatcher = passwordEncoder.matches(request.getPassword(), user.getPassword());
        if(!passwordMatcher){
            throw new InvalidCredentialsException(
                    "Invalid email or password"
            );
        }
        return LoginResponseDto.builder()
                .email(user.getEmail())
                .userName(user.getUserName())
                .role(user.getRole())
                .build();
    }

    public User isAuthenticated(Authentication authentication) {
        String Email = authentication.getName();
        return userRepository.findByEmailIgnoreCase(Email).orElseThrow(()->
                new AuthenticatedUserNotFoundException("Authenticated User Not Found"));
    }

}