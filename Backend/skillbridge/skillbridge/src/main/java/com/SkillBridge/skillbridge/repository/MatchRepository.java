package com.SkillBridge.skillbridge.repository;

import com.SkillBridge.skillbridge.entity.Match;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MatchRepository extends JpaRepository<Match, Long> {

    List<Match> findByUserIdOrderByMatchScoreDesc(Long userId);

    Optional<Match> findByUserIdAndMatchedUserId(
            Long userId,
            Long matchedUserId
    );

    boolean existsByUserIdAndMatchedUserId(
            Long userId,
            Long matchedUserId
    );

    void deleteByUserId(Long userId);

    void deleteByMatchedUserId(Long matchedUserId);
}