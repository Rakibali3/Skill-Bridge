package com.SkillBridge.skillbridge.repository;

import com.SkillBridge.skillbridge.entity.CommunityMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CommunityMemberRepository extends JpaRepository<CommunityMember, Long> {
    boolean existsByCommunityIdAndUserId(Long communityId, Long userId);
    Optional<CommunityMember> findByCommunityIdAndUserId(Long communityId, Long userId);
    List<CommunityMember> findByCommunityIdOrderByJoinedAtAsc(Long communityId);
    long countByCommunityId(Long communityId);
    void deleteByCommunityIdAndUserId(Long communityId, Long userId);
}