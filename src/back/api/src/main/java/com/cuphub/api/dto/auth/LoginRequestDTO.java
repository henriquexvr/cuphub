package com.cuphub.api.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequestDTO(
        @Email @NotBlank(message = "E-mail é obrigatório!") String email,
        @NotBlank(message = "E-mail é obrigatório!") String password) {
}
