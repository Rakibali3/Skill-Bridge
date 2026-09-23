package com.SkillBridge.skillbridge.repository;

import com.SkillBridge.skillbridge.entity.ExchangeSkill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExchangeSkillRepository extends JpaRepository<ExchangeSkill, Long> {
    List<ExchangeSkill> findByExchangeId(Long exchangeId);

    void deleteByExchangeId(Long exchangeId);
}