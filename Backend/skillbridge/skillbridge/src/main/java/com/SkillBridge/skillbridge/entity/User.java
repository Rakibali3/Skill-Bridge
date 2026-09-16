package com.SkillBridge.skillbridge.entity;

import jakarta.persistence.*;

import lombok.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
@Table(
        name = "app_users",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "email")
        }
)
public class User {

    @Id

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(
            nullable = false,
            length = 50
    )
    private String userName;


    @Column(
            nullable = false,
            unique = true,
            length = 254
    )
    private String email;


    @Column(nullable = false)
    private String password;
}