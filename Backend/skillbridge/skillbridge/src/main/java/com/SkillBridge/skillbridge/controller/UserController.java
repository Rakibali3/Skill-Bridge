package com.SkillBridge.skillbridge.controller;

import com.SkillBridge.skillbridge.dto.signUpRequestDto;
import com.SkillBridge.skillbridge.service.userService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {
     private final userService userService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody signUpRequestDto request){
         userService.signup(request);
        return ResponseEntity.ok("User received successfully");
     }
}
