package com.cuphub.api.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "team_invites")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TeamInvite {

    @Id
    @Column(name = "id", length = 36)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Team team;

    @Column(name = "invited_email", nullable = false)
    private String invitedEmail;

    @Column(nullable = false, unique = true)
    private String token;

    @Column(nullable = false)
    private String status = "pending";

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (this.id == null) this.id = UUID.randomUUID().toString();
        if (this.token == null) this.token = UUID.randomUUID().toString();
        this.createdAt = LocalDateTime.now();
        if (this.expiresAt == null) this.expiresAt = LocalDateTime.now().plusDays(7);
    }
}
