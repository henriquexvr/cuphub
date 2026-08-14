package com.cuphub.api.dto.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateUserDTO(
        @NotBlank(message = "Nome é obrigatório") String name,
        @NotBlank(message = "E-mail é obrigatório") @Email String email,
        @NotBlank(message = "Senha é obrigatório") @Size(min = 8, message = "A senha deve ter no mínimo 8 caracteres.") String password,
        @NotBlank(message = "Confirmar senha é obrigatório") String confirmPassword) {

}