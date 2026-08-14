package com.cuphub.api.service;

import com.cuphub.api.dto.indicator.IndicatorResponseDTO;
import com.cuphub.api.exception.BusinessException;
import com.cuphub.api.repository.MatchRepository;
import com.cuphub.api.repository.TeamInviteRepository;
import com.cuphub.api.repository.TournamentRegistrationRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class IndicatorServiceTest {

    @Mock
    private TournamentRegistrationRepository registrationRepository;
    @Mock
    private MatchRepository matchRepository;
    @Mock
    private TeamInviteRepository teamInviteRepository;
    @Mock
    private com.cuphub.api.repository.TournamentRepository tournamentRepository;

    @InjectMocks
    private IndicatorService indicatorService;

    @Test
    void shouldCalculateIndicatorsWithEmptyData() {
        when(registrationRepository.countAllByStatus("approved")).thenReturn(0L);
        when(registrationRepository.count()).thenReturn(0L);
        when(teamInviteRepository.countAllByStatus("accepted")).thenReturn(0L);
        when(teamInviteRepository.count()).thenReturn(0L);
        when(matchRepository.countAllByStatus("finished")).thenReturn(0L);
        when(matchRepository.count()).thenReturn(0L);
        when(matchRepository.getTeamPerformanceStats()).thenReturn(List.of());

        IndicatorResponseDTO result = indicatorService.getIndicators();

        assertEquals(0.0, result.taxaPreenchimentoVagas());
        assertEquals(0.0, result.taxaAceitacaoConvites());
        assertEquals(0.0, result.taxaAprovacaoInscricoes());
        assertEquals(0.0, result.taxaConclusaoPartidas());
        assertEquals(0.0, result.aproveitamentoMedioTimes());
    }

    @Test
    void shouldCalculateIndicatorsWithRealData() {
        when(registrationRepository.countAllByStatus("approved")).thenReturn(6L);
        when(registrationRepository.count()).thenReturn(8L);
        when(teamInviteRepository.countAllByStatus("accepted")).thenReturn(3L);
        when(teamInviteRepository.count()).thenReturn(5L);
        when(matchRepository.countAllByStatus("finished")).thenReturn(7L);
        when(matchRepository.count()).thenReturn(8L);
        when(matchRepository.getTeamPerformanceStats()).thenReturn(List.of());

        IndicatorResponseDTO result = indicatorService.getIndicators();

        assertEquals(75.0, result.taxaPreenchimentoVagas(), 0.01);
        assertEquals(60.0, result.taxaAceitacaoConvites(), 0.01);
        assertEquals(75.0, result.taxaAprovacaoInscricoes(), 0.01);
        assertEquals(87.5, result.taxaConclusaoPartidas(), 0.01);
    }

    @Test
    void shouldCalculateTeamIndicators() {
        Object[] teamA = {"teamA", 4L, 3L};
        when(matchRepository.getTeamPerformanceStats()).thenReturn(java.util.List.<Object[]>of(teamA));
        when(teamInviteRepository.countByTeamIdAndStatus("teamA", "accepted")).thenReturn(2L);
        when(teamInviteRepository.countByTeamId("teamA")).thenReturn(4L);

        var r = indicatorService.getTeamIndicators("teamA");

        assertEquals(75.0, r.aproveitamentoTime(), 0.01);
        assertEquals(50.0, r.taxaAceitacaoConvites(), 0.01);
        assertEquals(3L, r.totalVitorias());
        assertEquals(4L, r.totalPartidas());
    }

    @Test
    void shouldCalculateTournamentIndicators() {
        com.cuphub.api.entity.Tournament t = mock(com.cuphub.api.entity.Tournament.class);
        when(t.getMaxTeams()).thenReturn(8);
        com.cuphub.api.entity.User owner = mock(com.cuphub.api.entity.User.class);
        when(owner.getId()).thenReturn("org1");
        when(owner.getRole()).thenReturn("organizer");
        when(t.getOrganizer()).thenReturn(owner);
        when(tournamentRepository.findById("t1")).thenReturn(java.util.Optional.of(t));
        when(registrationRepository.countByTournamentIdAndStatus("t1", "approved")).thenReturn(6L);
        when(matchRepository.countByTournamentIdAndStatus("t1", "finished")).thenReturn(7L);
        when(matchRepository.countByTournamentId("t1")).thenReturn(8L);
        when(registrationRepository.countByTournamentId("t1")).thenReturn(8L);

        var r = indicatorService.getTournamentIndicators("t1", owner);

        assertEquals(75.0, r.taxaPreenchimentoVagas(), 0.01);
        assertEquals(87.5, r.taxaConclusaoPartidas(), 0.01);
        assertEquals(75.0, r.taxaAprovacaoInscricoes(), 0.01);
    }

    @Test
    void shouldRejectTournamentIndicatorsForNonOwner() {
        com.cuphub.api.entity.Tournament t = mock(com.cuphub.api.entity.Tournament.class);
        com.cuphub.api.entity.User owner = mock(com.cuphub.api.entity.User.class);
        when(owner.getId()).thenReturn("org1");
        when(t.getOrganizer()).thenReturn(owner);
        when(tournamentRepository.findById("t1")).thenReturn(java.util.Optional.of(t));

        com.cuphub.api.entity.User stranger = mock(com.cuphub.api.entity.User.class);
        when(stranger.getId()).thenReturn("other99");
        when(stranger.getRole()).thenReturn("participant");

        assertThrows(BusinessException.class,
            () -> indicatorService.getTournamentIndicators("t1", stranger));
    }

    @Test
    void shouldReturnZeroForTournamentWithoutData() {
        com.cuphub.api.entity.Tournament t = mock(com.cuphub.api.entity.Tournament.class);
        when(t.getMaxTeams()).thenReturn(0);
        com.cuphub.api.entity.User owner = mock(com.cuphub.api.entity.User.class);
        when(owner.getId()).thenReturn("org1");
        when(owner.getRole()).thenReturn("organizer");
        when(t.getOrganizer()).thenReturn(owner);
        when(tournamentRepository.findById("t1")).thenReturn(java.util.Optional.of(t));
        when(registrationRepository.countByTournamentIdAndStatus("t1", "approved")).thenReturn(0L);
        when(matchRepository.countByTournamentIdAndStatus("t1", "finished")).thenReturn(0L);
        when(matchRepository.countByTournamentId("t1")).thenReturn(0L);
        when(registrationRepository.countByTournamentId("t1")).thenReturn(0L);

        var r = indicatorService.getTournamentIndicators("t1", owner);

        assertEquals(0.0, r.taxaPreenchimentoVagas(), 0.01);
        assertEquals(0.0, r.taxaConclusaoPartidas(), 0.01);
        assertEquals(0.0, r.taxaAprovacaoInscricoes(), 0.01);
    }

    @Test
    void shouldRollupOrganizerIndicators() {
        com.cuphub.api.entity.Tournament t1 = mock(com.cuphub.api.entity.Tournament.class);
        when(t1.getId()).thenReturn("t1");
        when(t1.getMaxTeams()).thenReturn(8);
        when(tournamentRepository.findByOrganizerId("org1")).thenReturn(java.util.List.of(t1));
        when(tournamentRepository.findById("t1")).thenReturn(java.util.Optional.of(t1));
        when(registrationRepository.countByTournamentIdAndStatus("t1", "approved")).thenReturn(4L);
        when(matchRepository.countByTournamentIdAndStatus("t1", "finished")).thenReturn(2L);
        when(matchRepository.countByTournamentId("t1")).thenReturn(4L);
        when(registrationRepository.countByTournamentId("t1")).thenReturn(4L);

        var r = indicatorService.getOrganizerIndicators("org1");

        assertEquals(1, r.totalTorneios());
        assertEquals(50.0, r.taxaPreenchimentoMedia(), 0.01);  // 4/8
        assertEquals(50.0, r.taxaConclusaoMedia(), 0.01);      // 2/4
        assertEquals(100.0, r.taxaAprovacaoMedia(), 0.01);     // 4/4
    }

    @Test
    void shouldReturnZeroForOrganizerWithoutTournaments() {
        when(tournamentRepository.findByOrganizerId("org0")).thenReturn(java.util.List.of());

        var r = indicatorService.getOrganizerIndicators("org0");

        assertEquals(0, r.totalTorneios());
        assertEquals(0.0, r.taxaPreenchimentoMedia(), 0.01);
    }

    @Test
    void shouldReturnZeroForTeamWithoutData() {
        when(matchRepository.getTeamPerformanceStats()).thenReturn(java.util.List.of());
        when(teamInviteRepository.countByTeamIdAndStatus("x", "accepted")).thenReturn(0L);
        when(teamInviteRepository.countByTeamId("x")).thenReturn(0L);

        var r = indicatorService.getTeamIndicators("x");

        assertEquals(0.0, r.aproveitamentoTime(), 0.01);
        assertEquals(0.0, r.taxaAceitacaoConvites(), 0.01);
    }

    @Test
    void shouldCalculateAverageTeamPerformance() {
        when(registrationRepository.countAllByStatus("approved")).thenReturn(0L);
        when(registrationRepository.count()).thenReturn(0L);
        when(teamInviteRepository.countAllByStatus("accepted")).thenReturn(0L);
        when(teamInviteRepository.count()).thenReturn(0L);
        when(matchRepository.countAllByStatus("finished")).thenReturn(0L);
        when(matchRepository.count()).thenReturn(0L);

        Object[] teamA = {"teamA", 3L, 2L};
        Object[] teamB = {"teamB", 2L, 1L};
        when(matchRepository.getTeamPerformanceStats()).thenReturn(List.of(teamA, teamB));

        IndicatorResponseDTO result = indicatorService.getIndicators();

        assertEquals(58.33, result.aproveitamentoMedioTimes(), 0.01);
    }
}
