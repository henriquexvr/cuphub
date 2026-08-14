package com.cuphub.api.service;

import com.cuphub.api.entity.Match;
import com.cuphub.api.entity.Tournament;
import com.cuphub.api.repository.MatchRepository;
import com.cuphub.api.repository.TournamentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class TeamTitlesService {

    private final TournamentRepository tournamentRepository;
    private final MatchRepository matchRepository;

    public Map<String, Long> getTitlesByTeam() {
        Map<String, Long> titles = new HashMap<>();
        for (Tournament tournament : tournamentRepository.findByStatus("finished")) {
            List<Match> matches = matchRepository.findByTournamentIdOrderByRoundAscPositionAsc(tournament.getId());
            Match finalMatch = null;
            for (Match m : matches) {
                if (!"finished".equals(m.getStatus()) || m.getWinner() == null) continue;
                if (finalMatch == null || m.getRound() > finalMatch.getRound()) finalMatch = m;
            }
            if (finalMatch != null) {
                titles.merge(finalMatch.getWinner().getId(), 1L, Long::sum);
            }
        }
        return titles;
    }
}
