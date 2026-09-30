package com.SkillBridge.skillbridge.repository;

import com.SkillBridge.skillbridge.entity.Skill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface SkillRepository extends JpaRepository<Skill, Long> {
    Optional<Skill> findByNameIgnoreCase(String name);

    List<Skill> findByActiveTrueOrderByNameAsc();

    List<Skill> findAllByOrderByNameAsc();

    List<Skill> findTop5ByNameContainingIgnoreCase(String name);
}