package com.SkillBridge.skillbridge.repository;

import com.SkillBridge.skillbridge.entity.CommunityPost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CommunityPostRepository extends JpaRepository<CommunityPost, Long> {

    Page<CommunityPost> findByCommunityIdOrderByCreatedAtDesc(
            Long communityId,
            Pageable pageable
    );

    Optional<CommunityPost> findByIdAndCommunityId(
            Long postId,
            Long communityId
    );
}