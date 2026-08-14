package com.cuphub.api.dto.match;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record UpdateMatchResultDTO(
    @NotNull @Min(0) Integer homeScore,
    @NotNull @Min(0) Integer awayScore
) {}
