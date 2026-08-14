package com.cuphub.api.controller;

import com.cuphub.api.dto.match.MatchResponseDTO;
import com.cuphub.api.dto.match.UpdateMatchResultDTO;
import com.cuphub.api.entity.User;
import com.cuphub.api.service.MatchService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class MatchController {

    private final MatchService service;

    @PostMapping("/api/tournaments/{tournamentId}/bracket/generate")
    public ResponseEntity<List<MatchResponseDTO>> generate(
            @PathVariable String tournamentId,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(service.generateBracket(tournamentId, user));
    }

    @GetMapping("/api/tournaments/{tournamentId}/matches")
    public ResponseEntity<List<MatchResponseDTO>> listByTournament(
            @PathVariable String tournamentId) {
        return ResponseEntity.ok(service.listByTournament(tournamentId));
    }

    @PatchMapping("/api/matches/{matchId}/result")
    public ResponseEntity<MatchResponseDTO> updateResult(
            @PathVariable String matchId,
            @RequestBody @Valid UpdateMatchResultDTO dto,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(service.updateResult(matchId, dto, user));
    }
}
