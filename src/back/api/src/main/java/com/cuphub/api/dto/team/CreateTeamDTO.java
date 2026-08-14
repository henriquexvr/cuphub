package com.cuphub.api.dto.team;

import jakarta.validation.constraints.NotBlank;

public record CreateTeamDTO(
    @NotBlank String name,
    String description,
    String bannerUrl
) {}
