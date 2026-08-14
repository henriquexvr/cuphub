package com.cuphub.api.dto.registration;

import jakarta.validation.constraints.NotBlank;

public record CreateRegistrationDTO(
    @NotBlank String teamId,
    String notes
) {}
