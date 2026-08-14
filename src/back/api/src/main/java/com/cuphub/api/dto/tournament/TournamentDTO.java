package com.cuphub.api.dto.tournament;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record TournamentDTO(
    @NotBlank String name,
    String description,
    String bannerUrl,
    @NotNull LocalDateTime startDate,
    @NotNull LocalDateTime endDate,
    @Min(2) Integer maxTeams,
    Integer pointsWin,
    Integer pointsDraw,
    Integer pointsLoss,
    String notes
) {}
