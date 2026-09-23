package com.SkillBridge.skillbridge.entity;

import com.SkillBridge.skillbridge.enums.ExchangeSkillDirection;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(
        name = "exchange_skills",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_exchange_user_skill",
                        columnNames = {"exchange_id", "user_id", "skill_id"}
                )
        }
)
public class ExchangeSkill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exchange_id", nullable = false)
    @ToString.Exclude
    private Exchange exchange;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @ToString.Exclude
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "skill_id", nullable = false)
    @ToString.Exclude
    private Skill skill;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ExchangeSkillDirection direction;
}