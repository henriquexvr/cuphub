package com.cuphub.api.dto.auth;

public record LoginResponseDTO(
    String token,
    String userId,
    String name,
    String email,
    String role
) {}
