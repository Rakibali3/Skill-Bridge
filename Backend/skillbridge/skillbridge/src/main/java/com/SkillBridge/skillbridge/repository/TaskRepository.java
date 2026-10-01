package com.SkillBridge.skillbridge.repository;

import com.SkillBridge.skillbridge.entity.Task;
import com.SkillBridge.skillbridge.enums.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByExchangeIdOrderByCreatedAtDesc(Long exchangeId);

    Optional<Task> findByIdAndExchangeId(Long taskId, Long exchangeId);

    List<Task> findByAssignedToIdAndStatus(
            Long userId,
            TaskStatus status
    );

    List<Task> findByAssignedToId(Long userId);

    List<Task> findByExchangeIdAndAssignedToId(Long exchangeId, Long userId);
}