package com.cuphub.api.dto.user;

import com.cuphub.api.entity.User;

import java.time.LocalDateTime;

public record UserResponseDTO(
        String id,
        String name,
        String email,
        String role,
        LocalDateTime createdAt) {

    public static UserResponseDTO from(User user) {
        return new UserResponseDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getCreatedAt());
    }
}
