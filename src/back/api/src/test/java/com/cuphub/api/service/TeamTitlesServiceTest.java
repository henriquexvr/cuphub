package com.cuphub.api.service;

import com.cuphub.api.entity.Match;
import com.cuphub.api.entity.Team;
import com.cuphub.api.entity.Tournament;
import com.cuphub.api.repository.MatchRepository;
import com.cuphub.api.repository.TournamentRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class TeamTitlesServiceTest {

    @Mock private TournamentRepository tournamentRepository;
    @Mock private MatchRepository matchRepository;
    @InjectMocks private TeamTitlesService service;

    private Match match(int round, String status, String winnerId) {
        Match m = mock(Match.class);
        when(m.getStatus()).thenReturn(status);
        when(m.getRound()).thenReturn(round);
        if (winnerId != null) {
            Team t = mock(Team.class);
            when(t.getId()).thenReturn(winnerId);
            when(m.getWinner()).thenReturn(t);
        } else {
            when(m.getWinner()).thenReturn(null);
        }
        return m;
    }

    private Tournament tournament(String id) {
        Tournament t = mock(Tournament.class);
        when(t.getId()).thenReturn(id);
        return t;
    }

    @Test
    void championOfFinalRoundGetsOneTitle() {
        Tournament t1 = tournament("t1");
        Match m1 = match(1, "finished", "teamB");
        Match m2 = match(2, "finished", "teamA");
        when(tournamentRepository.findByStatus("finished")).thenReturn(List.of(t1));
        when(matchRepository.findByTournamentIdOrderByRoundAscPositionAsc("t1"))
            .thenReturn(List.of(m1, m2));

        Map<String, Long> titles = service.getTitlesByTeam();

        assertEquals(1L, titles.get("teamA"));
        assertNull(titles.get("teamB")); // só a final (maior round) conta
    }

    @Test
    void sameTeamWinningTwoTournamentsGetsTwoTitles() {
        Tournament t1 = tournament("t1");
        Tournament t2 = tournament("t2");
        Match m1 = match(2, "finished", "teamA");
        Match m2 = match(2, "finished", "teamA");
        when(tournamentRepository.findByStatus("finished"))
            .thenReturn(List.of(t1, t2));
        when(matchRepository.findByTournamentIdOrderByRoundAscPositionAsc("t1"))
            .thenReturn(List.of(m1));
        when(matchRepository.findByTournamentIdOrderByRoundAscPositionAsc("t2"))
            .thenReturn(List.of(m2));

        Map<String, Long> titles = service.getTitlesByTeam();

        assertEquals(2L, titles.get("teamA"));
    }

    @Test
    void tournamentWithoutFinishedFinalScoresNobody() {
        Tournament t1 = tournament("t1");
        when(tournamentRepository.findByStatus("finished")).thenReturn(List.of(t1));
        when(matchRepository.findByTournamentIdOrderByRoundAscPositionAsc("t1"))
            .thenReturn(List.of());

        Map<String, Long> titles = service.getTitlesByTeam();

        assertTrue(titles.isEmpty());
    }
}
