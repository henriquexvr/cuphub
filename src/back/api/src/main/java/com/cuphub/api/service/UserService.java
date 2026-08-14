package com.cuphub.api.service;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.cuphub.api.dto.user.CreateUserDTO;
import com.cuphub.api.entity.User;
import com.cuphub.api.exception.BusinessException;
import com.cuphub.api.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public User findById(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Usuário não encontrado."));
    }

    public User create(CreateUserDTO dto) {
        if (userRepository.findByEmail(dto.email()).isPresent()) {
            throw new BusinessException("E-mail já cadastrado!");
        }
        if (!dto.confirmPassword().equals(dto.password())) {
            throw new BusinessException("Confirme a senha!");
        }
        User user = new User();
        user.setName(dto.name());
        user.setEmail(dto.email());
        user.setPassword(passwordEncoder.encode(dto.password()));
        userRepository.save(user);
        return user;
    }

    public void delete(String id) {
        if (!userRepository.existsById(id)) {
            throw new BusinessException("Usuário não encontrado.");
        }
        userRepository.deleteById(id);
    }

    public User updateRole(String id, String role) {
        if (!role.equals("admin") && !role.equals("organizer") && !role.equals("participant")) {
            throw new BusinessException("Role inválido. Use 'admin', 'organizer' ou 'participant'.");
        }
        User user = findById(id);
        user.setRole(role);
        userRepository.save(user);
        return user;
    }
}
