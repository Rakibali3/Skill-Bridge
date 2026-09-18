package com.SkillBridge.skillbridge.repository;

import com.SkillBridge.skillbridge.entity.UserSkill;
import com.SkillBridge.skillbridge.enums.SkillType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserSkillRepository extends JpaRepository<UserSkill, Long> {

    boolean existsByUserIdAndSkillIdAndSkillType(Long id, Long id1, SkillType skillType);

    List<UserSkill> findByUserId(Long userId);

    List<UserSkill> findByUserIdAndSkillType(Long userId, SkillType skillType);

    Optional<UserSkill> findByIdAndUserId(Long id, Long userId);

}