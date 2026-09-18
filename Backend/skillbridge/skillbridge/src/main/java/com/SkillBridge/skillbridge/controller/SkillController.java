package com.SkillBridge.skillbridge.controller;

import com.SkillBridge.skillbridge.dto.SkillRequestDto;
import com.SkillBridge.skillbridge.dto.SkillResponseDto;
import com.SkillBridge.skillbridge.service.SkillService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/skills")
public class SkillController {
    private final SkillService skillService;

    @PostMapping
    public ResponseEntity<SkillResponseDto> addSkill(
            Authentication authentication, @Valid @RequestBody SkillRequestDto skillRequestDto){
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(skillService.addSkill(authentication,skillRequestDto));
    }

    @GetMapping
    public ResponseEntity<List<SkillResponseDto>> getSkills(Authentication authentication){
        return ResponseEntity.ok(skillService.getSkills(authentication));
    }

    @GetMapping("/available")
    public ResponseEntity<List<SkillResponseDto>> getAvailableSkills() {

        return ResponseEntity.ok(skillService.getAvailableSkills());
    }

    @GetMapping("/teaching")
    public ResponseEntity<List<SkillResponseDto>> getTeachingSkills(Authentication authentication) {

        return ResponseEntity.ok(skillService.getTeachingSkills(authentication));
    }

    @GetMapping("/learning")
    public ResponseEntity<List<SkillResponseDto>> getLearningSkills(Authentication authentication) {

        return ResponseEntity.ok(skillService.getLearningSkills(authentication));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SkillResponseDto> updateSkill(
            Authentication authentication,
            @RequestBody @Valid SkillRequestDto skillRequestDto,
            @PathVariable Long id){

        return ResponseEntity.ok(skillService.updateSkill(authentication,skillRequestDto,id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteSkill(Authentication authentication, @PathVariable Long id) {

        skillService.deleteSkill(authentication, id);

        return ResponseEntity.ok(Map.of("message", "Skill deleted successfully"));
    }
}
