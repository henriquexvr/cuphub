package com.cuphub.api.dto.registration;

import com.cuphub.api.entity.TournamentRegistration;

import java.time.LocalDateTime;

public record RegistrationResponseDTO(
    String id,
    String tournamentId,
    String tournamentName,
    LocalDateTime tournamentStartDate,
    LocalDateTime tournamentEndDate,
    String tournamentStatus,
    String teamId,
    String teamName,
    String notes,
    String status,
    String rejectionReason,
    LocalDateTime createdAt
) {
    public static RegistrationResponseDTO from(TournamentRegistration r) {
        return new RegistrationResponseDTO(
            r.getId(),
            r.getTournament().getId(),
            r.getTournament().getName(),
            r.getTournament().getStartDate(),
            r.getTournament().getEndDate(),
            r.getTournament().getStatus(),
            r.getTeam().getId(),
            r.getTeam().getName(),
            r.getNotes(),
            r.getStatus(),
            r.getRejectionReason(),
            r.getCreatedAt()
        );
    }
}
