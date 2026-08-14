package com.cuphub.api.dto.auth;

public record RegisterResponseDTO(
    String userId,
    String name,
    String email,
    String role,
    String token
) {}
