package com.cuphub.api.controller;

import com.cuphub.api.dto.registration.CreateRegistrationDTO;
import com.cuphub.api.dto.registration.RegistrationResponseDTO;
import com.cuphub.api.dto.registration.ReviewRegistrationDTO;
import com.cuphub.api.entity.User;
import com.cuphub.api.service.RegistrationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class RegistrationController {

    private final RegistrationService service;

    @PostMapping("/api/tournaments/{tournamentId}/registrations")
    public ResponseEntity<RegistrationResponseDTO> register(
            @PathVariable String tournamentId,
            @RequestBody @Valid CreateRegistrationDTO dto,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.register(tournamentId, dto, user));
    }

    @GetMapping("/api/tournaments/{tournamentId}/registrations")
    public ResponseEntity<List<RegistrationResponseDTO>> listByTournament(
            @PathVariable String tournamentId) {
        return ResponseEntity.ok(service.listByTournament(tournamentId));
    }

    @GetMapping("/api/teams/{teamId}/registrations")
    public ResponseEntity<List<RegistrationResponseDTO>> listByTeam(
            @PathVariable String teamId) {
        return ResponseEntity.ok(service.listByTeam(teamId));
    }

    @GetMapping("/api/registrations/my")
    public ResponseEntity<List<RegistrationResponseDTO>> listMy(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(service.listByUser(user));
    }

    @PatchMapping("/api/registrations/{registrationId}/review")
    public ResponseEntity<RegistrationResponseDTO> review(
            @PathVariable String registrationId,
            @RequestBody @Valid ReviewRegistrationDTO dto,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(service.review(registrationId, dto, user));
    }
}
