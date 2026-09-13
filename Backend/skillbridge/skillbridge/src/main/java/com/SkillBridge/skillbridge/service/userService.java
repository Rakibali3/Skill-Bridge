package com.SkillBridge.skillbridge.service;

import com.SkillBridge.skillbridge.dto.signUpRequestDto;
import com.SkillBridge.skillbridge.entity.user;
import com.SkillBridge.skillbridge.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class userService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public void signup(signUpRequestDto request) {
        user user = new user();
        user.setUserName(request.getUserName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);
    }
}
