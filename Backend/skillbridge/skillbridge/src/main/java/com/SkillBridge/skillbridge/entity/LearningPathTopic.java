package com.SkillBridge.skillbridge.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "learning_path_topics")
public class LearningPathTopic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "learning_path_id",
            nullable = false
    )
    @ToString.Exclude
    private LearningPath learningPath;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private Integer orderIndex;

    @Column(length = 500)
    private String resourceUrl;

    @Column(nullable = false)
    @Builder.Default
    private boolean active = true;
}