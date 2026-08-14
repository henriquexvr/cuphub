package com.cuphub.api.controller;

import com.cuphub.api.dto.tournament.TournamentDTO;
import com.cuphub.api.entity.Tournament;
import com.cuphub.api.entity.User;
import com.cuphub.api.service.TournamentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tournaments")
@RequiredArgsConstructor
public class TournamentController {

    private final TournamentService service;

    @PostMapping
    public ResponseEntity<Tournament> create(
            @RequestBody @Valid TournamentDTO dto,
            @AuthenticationPrincipal User organizer) {
        Tournament created = service.create(dto, organizer);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    public ResponseEntity<List<Tournament>> listAll() {
        return ResponseEntity.ok(service.listAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tournament> getById(@PathVariable String id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @GetMapping("/pending")
    public ResponseEntity<List<Tournament>> listPending() {
        return ResponseEntity.ok(service.listPending());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Tournament> updateStatus(
            @PathVariable String id,
            @RequestParam String status,
            @RequestParam(required = false) String rejectionReason) {
        return ResponseEntity.ok(service.updateStatus(id, status, rejectionReason));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Tournament> update(
            @PathVariable String id,
            @RequestBody @Valid TournamentDTO dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> delete(@PathVariable String id) {
        service.delete(id);
        return ResponseEntity.ok(Map.of("message", "Torneio removido."));
    }
}
