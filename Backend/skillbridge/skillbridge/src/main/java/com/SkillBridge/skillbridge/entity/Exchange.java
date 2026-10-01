package com.SkillBridge.skillbridge.entity;

import com.SkillBridge.skillbridge.enums.ExchangeStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(
        name = "exchanges",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_exchange_users", columnNames = {"user1_id", "user2_id"})
        }
)
public class Exchange {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user1_id", nullable = false)
    @ToString.Exclude
    private User user1;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user2_id", nullable = false)
    @ToString.Exclude
    private User user2;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private ExchangeStatus status = ExchangeStatus.ACTIVE;

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "user1_completion_confirmed", nullable = false)
    @ColumnDefault("false")
    @Builder.Default
    private boolean user1CompletionConfirmed = false;

    @Column(name = "user2_completion_confirmed", nullable = false)
    @ColumnDefault("false")
    @Builder.Default
    private boolean user2CompletionConfirmed = false;

    private LocalDateTime completedAt;
}