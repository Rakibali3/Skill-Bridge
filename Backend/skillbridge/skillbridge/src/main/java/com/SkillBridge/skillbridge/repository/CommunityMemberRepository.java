package com.SkillBridge.skillbridge.repository;

import com.SkillBridge.skillbridge.entity.CommunityMember;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CommunityMemberRepository
        extends JpaRepository<CommunityMember, Long> {

    boolean existsByCommunityIdAndUserId(
            Long communityId,
            Long userId
    );

    Optional<CommunityMember> findByCommunityIdAndUserId(
            Long communityId,
            Long userId
    );

    Page<CommunityMember> findByCommunityIdOrderByJoinedAtAsc(
            Long communityId,
            Pageable pageable
    );

    long countByCommunityId(Long communityId);

    void deleteByCommunityIdAndUserId(
            Long communityId,
            Long userId
    );
}