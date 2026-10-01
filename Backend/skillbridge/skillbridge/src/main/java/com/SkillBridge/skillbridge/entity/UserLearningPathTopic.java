package com.SkillBridge.skillbridge.entity;

import com.SkillBridge.skillbridge.enums.LearningPathProgressStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(
        name = "user_learning_path_topics",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_user_path_topic",
                        columnNames = {"user_learning_path_id", "learning_path_topic_id"}
                )
        }
)
public class UserLearningPathTopic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_learning_path_id", nullable = false)
    @ToString.Exclude
    private UserLearningPath userLearningPath;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "learning_path_topic_id", nullable = false)
    @ToString.Exclude
    private LearningPathTopic learningPathTopic;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private LearningPathProgressStatus status = LearningPathProgressStatus.NOT_STARTED;

    @Column(nullable = false)
    @Builder.Default
    private Integer progress = 0;

    private LocalDateTime startedAt;

    private LocalDateTime completedAt;
}