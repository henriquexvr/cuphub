package com.cuphub.api.dto.team;

import com.cuphub.api.entity.TeamInvite;

import java.time.LocalDateTime;

public record InviteResponseDTO(
    String id,
    String teamId,
    String teamName,
    String invitedEmail,
    String token,
    String status,
    LocalDateTime expiresAt,
    LocalDateTime createdAt
) {
    public static InviteResponseDTO from(TeamInvite invite) {
        return new InviteResponseDTO(
            invite.getId(),
            invite.getTeam().getId(),
            invite.getTeam().getName(),
            invite.getInvitedEmail(),
            invite.getToken(),
            invite.getStatus(),
            invite.getExpiresAt(),
            invite.getCreatedAt()
        );
    }
}
