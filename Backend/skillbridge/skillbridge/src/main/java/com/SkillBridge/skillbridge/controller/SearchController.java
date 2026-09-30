package com.SkillBridge.skillbridge.controller;

import com.SkillBridge.skillbridge.dto.GlobalSearchResponseDto;
import com.SkillBridge.skillbridge.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/search")
public class SearchController {

    private final SearchService searchService;

    @GetMapping
    public ResponseEntity<GlobalSearchResponseDto> search(@RequestParam String q) {
        return ResponseEntity.ok(searchService.search(q));
    }
}