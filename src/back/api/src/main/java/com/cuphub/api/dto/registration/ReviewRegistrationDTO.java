package com.cuphub.api.dto.registration;

import jakarta.validation.constraints.NotBlank;

public record ReviewRegistrationDTO(
    @NotBlank String status,
    String rejectionReason
) {}
