package com.SkillBridge.skillbridge.entity;

import com.SkillBridge.skillbridge.enums.SkillLevel;
import com.SkillBridge.skillbridge.enums.SkillType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "user_skills", uniqueConstraints = {@UniqueConstraint(name = "uk_user_skill_type",
                        columnNames = {
                                "user_id",
                                "skill_id",
                                "skill_type"})})
public class UserSkill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "user_id",
            nullable = false
    )
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "skill_id",
            nullable = false
    )
    private Skill skill;

    @Enumerated(EnumType.STRING)
    @Column(
            name = "skill_type",
            nullable = false,
            length = 20
    )
    private SkillType skillType;

    @Enumerated(EnumType.STRING)
    @Column(
            nullable = false,
            length = 20
    )
    private SkillLevel level;

    @Column(length = 50)
    private String experience;

    @Column(length = 500)
    private String description;

    @Column(length = 500)
    private String learningGoal;

}
