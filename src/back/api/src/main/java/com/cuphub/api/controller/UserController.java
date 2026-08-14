package com.cuphub.api.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.cuphub.api.dto.user.CreateUserDTO;
import com.cuphub.api.dto.user.UserResponseDTO;
import com.cuphub.api.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public List<UserResponseDTO> findAll() {
        return userService.findAll().stream().map(UserResponseDTO::from).toList();
    }

    @GetMapping("/{id}")
    public UserResponseDTO findById(@PathVariable String id) {
        return UserResponseDTO.from(userService.findById(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponseDTO create(@RequestBody @Valid CreateUserDTO dto) {
        return UserResponseDTO.from(userService.create(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> delete(@PathVariable String id) {
        userService.delete(id);
        return ResponseEntity.ok(Map.of("message", "Usuário removido."));
    }

    @PatchMapping("/{id}/role")
    public UserResponseDTO updateRole(
            @PathVariable String id,
            @RequestParam String role) {
        return UserResponseDTO.from(userService.updateRole(id, role));
    }
}
