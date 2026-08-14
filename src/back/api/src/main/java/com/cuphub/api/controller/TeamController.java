package com.cuphub.api.controller;

import com.cuphub.api.dto.team.CreateTeamDTO;
import com.cuphub.api.dto.team.InviteResponseDTO;
import com.cuphub.api.dto.team.TeamResponseDTO;
import com.cuphub.api.dto.team.UpdateTeamDTO;
import com.cuphub.api.entity.User;
import com.cuphub.api.service.TeamService;
import com.cuphub.api.service.TeamTitlesService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/teams")
@RequiredArgsConstructor
public class TeamController {

    private final TeamService service;
    private final TeamTitlesService teamTitlesService;

    @GetMapping("/titles")
    public ResponseEntity<Map<String, Long>> titles() {
        return ResponseEntity.ok(teamTitlesService.getTitlesByTeam());
    }

    @PostMapping
    public ResponseEntity<TeamResponseDTO> create(
            @RequestBody @Valid CreateTeamDTO dto,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(dto, user));
    }

    @GetMapping
    public ResponseEntity<List<TeamResponseDTO>> listAll() {
        return ResponseEntity.ok(service.listAll());
    }

    @GetMapping("/mine")
    public ResponseEntity<List<TeamResponseDTO>> listMine(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(service.listMyTeams(user.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TeamResponseDTO> getById(@PathVariable String id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TeamResponseDTO> update(
            @PathVariable String id,
            @RequestBody @Valid UpdateTeamDTO dto,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(service.update(id, dto, user));
    }

    @PostMapping("/{id}/invites")
    public ResponseEntity<InviteResponseDTO> invite(
            @PathVariable String id,
            @RequestParam String email,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.sendInvite(id, email, user));
    }

    @GetMapping("/invites/{token}")
    public ResponseEntity<InviteResponseDTO> getInvite(@PathVariable String token) {
        return ResponseEntity.ok(service.getInviteByToken(token));
    }

    @PostMapping("/invites/{token}/accept")
    public ResponseEntity<TeamResponseDTO> acceptInvite(
            @PathVariable String token,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(service.acceptInvite(token, user));
    }

    @PostMapping("/invites/{token}/reject")
    public ResponseEntity<Map<String, String>> rejectInvite(
            @PathVariable String token,
            @AuthenticationPrincipal User user) {
        service.rejectInvite(token, user);
        return ResponseEntity.ok(Map.of("message", "Convite recusado."));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> delete(
            @PathVariable String id,
            @AuthenticationPrincipal User user) {
        service.delete(id, user);
        return ResponseEntity.ok(Map.of("message", "Time removido."));
    }
}
