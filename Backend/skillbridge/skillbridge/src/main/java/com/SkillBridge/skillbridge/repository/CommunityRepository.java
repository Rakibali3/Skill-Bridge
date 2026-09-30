package com.SkillBridge.skillbridge.repository;

import com.SkillBridge.skillbridge.entity.Community;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CommunityRepository extends JpaRepository<Community, Long> {
    boolean existsByNameIgnoreCase(String name);
    Optional<Community> findByIdAndActiveTrue(Long id);
    Page<Community> findByActiveTrue(Pageable pageable);
    List<Community> findTop5ByNameContainingIgnoreCaseAndActiveTrue(String name);
}