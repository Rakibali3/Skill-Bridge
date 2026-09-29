package com.SkillBridge.skillbridge.repository;

import com.SkillBridge.skillbridge.entity.CommunityComment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CommunityCommentRepository extends JpaRepository<CommunityComment, Long> {

    List<CommunityComment> findByPostIdOrderByCreatedAtAsc(Long postId);

    Optional<CommunityComment> findByIdAndPostId(
            Long commentId,
            Long postId
    );

    long countByPostId(Long postId);
}