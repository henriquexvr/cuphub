package com.cuphub.api.dto.team;

import jakarta.validation.constraints.NotBlank;

public record UpdateTeamDTO(
    @NotBlank String name,
    String description,
    String bannerUrl
) {}
