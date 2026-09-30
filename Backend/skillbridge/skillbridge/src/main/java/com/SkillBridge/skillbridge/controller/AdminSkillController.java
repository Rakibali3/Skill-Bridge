package com.SkillBridge.skillbridge.controller;

import com.SkillBridge.skillbridge.dto.AdminSkillRequestDto;
import com.SkillBridge.skillbridge.entity.Skill;
import com.SkillBridge.skillbridge.service.AdminSkillService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/skills")
@RequiredArgsConstructor
public class AdminSkillController {

    private final AdminSkillService adminSkillService;

    @PostMapping
    public ResponseEntity<Skill> createSkill(
            @Valid @RequestBody AdminSkillRequestDto request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(adminSkillService.createSkill(request));
    }

    @GetMapping
    public ResponseEntity<List<Skill>> getAllSkills() {

        return ResponseEntity.ok(adminSkillService.getAllSkills());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Skill> updateSkill(
            @PathVariable Long id,
            @Valid @RequestBody AdminSkillRequestDto request) {

        return ResponseEntity.ok(adminSkillService.updateSkill(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deactivateSkill(
            @PathVariable Long id) {

        adminSkillService.deactivateSkill(id);

        return ResponseEntity.ok(Map.of("message", "Skill deactivated successfully"));
    }

    @PatchMapping("/{id}/activate")
    public ResponseEntity<Map<String, String>> activateSkill(
            @PathVariable Long id) {

        adminSkillService.activateSkill(id);

        return ResponseEntity.ok(Map.of("message", "Skill activated successfully"));
    }
}