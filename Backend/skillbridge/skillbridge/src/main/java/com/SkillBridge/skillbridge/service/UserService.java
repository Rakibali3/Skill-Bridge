package com.SkillBridge.skillbridge.service;

import com.SkillBridge.skillbridge.ExceptionHandling.EmailAlreadyExistsException;
import com.SkillBridge.skillbridge.ExceptionHandling.InvalidCredentialsException;
import com.SkillBridge.skillbridge.dto.LoginRequestDto;
import com.SkillBridge.skillbridge.dto.LoginResponseDto;
import com.SkillBridge.skillbridge.dto.SignupRequestDto;
import com.SkillBridge.skillbridge.entity.User;
import com.SkillBridge.skillbridge.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.stereotype.Service;

import java.util.Locale;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

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

                .password(
                        passwordEncoder.encode(
                                request.getPassword()
                        )
                )

                .build();


        return userRepository.save(user);
    }

    public LoginResponseDto login(LoginRequestDto request) {
        String email = request.getEmail()
                        .trim()
                        .toLowerCase(Locale.ROOT);
        User user = userRepository.findByEmailIgnoreCase(email).
                orElseThrow(() -> new InvalidCredentialsException( "Invalid email or password"));
        boolean passwordMatcher = passwordEncoder.matches(request.getPassword(), user.getPassword());
        if(!passwordMatcher){
            throw new InvalidCredentialsException(
                    "Invalid email or password"
            );
        }
        return LoginResponseDto.builder()
                .email(user.getEmail())
                .userName(user.getUserName())
                .build();
    }
}