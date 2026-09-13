package com.SkillBridge.skillbridge.repository;

import com.SkillBridge.skillbridge.entity.user;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<user, Long> {
}