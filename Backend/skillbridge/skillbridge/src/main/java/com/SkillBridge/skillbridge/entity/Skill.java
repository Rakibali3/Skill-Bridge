package com.SkillBridge.skillbridge.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@Table(name = "skills", uniqueConstraints = {@UniqueConstraint(name = "uk_skill_name", columnNames = "name")})
public class Skill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(length = 100)
    private String category;

    @Column(nullable = false)
    @Builder.Default
    private boolean active = true;
}
