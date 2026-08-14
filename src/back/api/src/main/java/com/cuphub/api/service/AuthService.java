package com.cuphub.api.service;

import com.cuphub.api.dto.auth.*;
import com.cuphub.api.entity.User;
import com.cuphub.api.exception.BusinessException;
import com.cuphub.api.exception.EntityNotFoundException;
import com.cuphub.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public RegisterResponseDTO register(RegisterRequestDTO dto) {
        if (userRepository.findByEmail(dto.email()).isPresent()) {
            throw new BusinessException("E-mail já cadastrado.");
        }

        String role;
        if (userRepository.count() == 0) {
            role = "admin";
        } else {
            role = "organizer".equals(dto.role()) ? "organizer" : "participant";
        }

        User user = new User();
        user.setName(dto.name());
        user.setEmail(dto.email());
        user.setPassword(passwordEncoder.encode(dto.password()));
        user.setRole(role);
        userRepository.save(user);
        String token = jwtService.generateToken(user);

        return new RegisterResponseDTO(user.getId(), user.getName(), user.getEmail(), user.getRole(), token);
    }

    public LoginResponseDTO login(LoginRequestDTO dto) {
        User user = userRepository.findByEmail(dto.email())
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado."));
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(dto.email(), dto.password())
            );
        } catch (BadCredentialsException e) {
            throw new BusinessException("Senha incorreta.");
        }
        String token = jwtService.generateToken(user);
        return new LoginResponseDTO(token, user.getId(), user.getName(), user.getEmail(), user.getRole());
    }
}
