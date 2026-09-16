package com.SkillBridge.skillbridge.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "user_profile")
public class UserProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(length = 500)
    private String bio;

    @Column(length = 100)
    private String location;

    @Column(length = 50)
    private String experience;

    @Column(length = 50)
    private String learningStyle;

    @Column(length = 100)
    private String preferredFormat;

    @Column(length = 100)
    private String availability;

    @Column(length = 500)
    private String avatarUrl;
}
