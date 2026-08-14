package com.cuphub.api.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequestDTO(
        @NotBlank(message = "Nome é obrigatório") String name,
        @NotBlank(message = "E-mail é obrigatório") @Email String email,
        @NotBlank(message = "Senha é obrigatório") @Size(min = 8, message = "Senha deve ter pelo menos 8 caracteres") String password,
        String confirmPassword,
        String role
) {}
