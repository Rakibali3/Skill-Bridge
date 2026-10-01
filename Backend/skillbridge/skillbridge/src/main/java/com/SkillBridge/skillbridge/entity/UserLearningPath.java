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
        name = "user_learning_paths",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_user_learning_path",
                        columnNames = {"user_id", "learning_path_id"}
                )
        }
)
public class UserLearningPath {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @ToString.Exclude
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "learning_path_id", nullable = false)
    @ToString.Exclude
    private LearningPath learningPath;



    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private LearningPathProgressStatus status = LearningPathProgressStatus.NOT_STARTED;

    @Column(nullable = false)
    @Builder.Default
    private Integer progress = 0;

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime startedAt = LocalDateTime.now();

    private LocalDateTime completedAt;
}