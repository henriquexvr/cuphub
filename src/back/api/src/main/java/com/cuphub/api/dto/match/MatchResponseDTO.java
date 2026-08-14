package com.cuphub.api.dto.match;

import com.cuphub.api.entity.Match;

import java.time.LocalDateTime;

public record MatchResponseDTO(
    String id,
    String tournamentId,
    int round,
    int position,
    String homeTeamId,
    String homeTeamName,
    String awayTeamId,
    String awayTeamName,
    Integer homeScore,
    Integer awayScore,
    String status,
    String winnerId,
    String winnerName,
    LocalDateTime scheduledAt
) {
    public static MatchResponseDTO from(Match m) {
        return new MatchResponseDTO(
            m.getId(),
            m.getTournament().getId(),
            m.getRound(),
            m.getPosition(),
            m.getHomeTeam() != null ? m.getHomeTeam().getId() : null,
            m.getHomeTeam() != null ? m.getHomeTeam().getName() : null,
            m.getAwayTeam() != null ? m.getAwayTeam().getId() : null,
            m.getAwayTeam() != null ? m.getAwayTeam().getName() : null,
            m.getHomeScore(),
            m.getAwayScore(),
            m.getStatus(),
            m.getWinner() != null ? m.getWinner().getId() : null,
            m.getWinner() != null ? m.getWinner().getName() : null,
            m.getScheduledAt()
        );
    }
}
