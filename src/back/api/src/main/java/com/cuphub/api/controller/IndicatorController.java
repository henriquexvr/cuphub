package com.cuphub.api.controller;

import com.cuphub.api.dto.indicator.IndicatorResponseDTO;
import com.cuphub.api.dto.indicator.OrganizerIndicatorResponseDTO;
import com.cuphub.api.dto.indicator.TeamIndicatorResponseDTO;
import com.cuphub.api.dto.indicator.TournamentIndicatorResponseDTO;
import com.cuphub.api.entity.User;
import com.cuphub.api.service.IndicatorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class IndicatorController {

    private final IndicatorService indicatorService;

    @GetMapping("/api/indicators")
    public ResponseEntity<IndicatorResponseDTO> getIndicators() {
        return ResponseEntity.ok(indicatorService.getIndicators());
    }

    @GetMapping("/api/indicators/team/{teamId}")
    public ResponseEntity<TeamIndicatorResponseDTO> getTeamIndicators(@PathVariable String teamId) {
        return ResponseEntity.ok(indicatorService.getTeamIndicators(teamId));
    }

    @GetMapping("/api/indicators/tournament/{tournamentId}")
    public ResponseEntity<TournamentIndicatorResponseDTO> getTournamentIndicators(
            @PathVariable String tournamentId,
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.cuphub.api.entity.User user) {
        return ResponseEntity.ok(indicatorService.getTournamentIndicators(tournamentId, user));
    }

    @GetMapping("/api/indicators/organizer/me")
    public ResponseEntity<OrganizerIndicatorResponseDTO> getMyOrganizerIndicators(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(indicatorService.getOrganizerIndicators(user.getId()));
    }
}
