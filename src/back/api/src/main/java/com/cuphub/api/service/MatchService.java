package com.cuphub.api.service;

import com.cuphub.api.dto.match.MatchResponseDTO;
import com.cuphub.api.dto.match.UpdateMatchResultDTO;
import com.cuphub.api.entity.Match;
import com.cuphub.api.entity.Team;
import com.cuphub.api.entity.Tournament;
import com.cuphub.api.entity.TournamentRegistration;
import com.cuphub.api.entity.User;
import com.cuphub.api.exception.BusinessException;
import com.cuphub.api.exception.EntityNotFoundException;
import com.cuphub.api.repository.MatchRepository;
import com.cuphub.api.repository.TournamentRegistrationRepository;
import com.cuphub.api.repository.TournamentRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MatchService {

    private final MatchRepository matchRepository;
    private final TournamentRepository tournamentRepository;
    private final TournamentRegistrationRepository registrationRepository;

    @Transactional
    public List<MatchResponseDTO> generateBracket(String tournamentId, User user) {
        Tournament tournament = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new EntityNotFoundException("Torneio não encontrado"));

        if (!tournament.getOrganizer().getId().equals(user.getId())) {
            throw new BusinessException("Somente o organizador pode gerar o chaveamento.");
        }

        matchRepository.deleteByTournamentId(tournamentId);

        List<Team> teams = registrationRepository.findByTournamentId(tournamentId).stream()
                .filter(r -> r.getStatus().equals("approved"))
                .map(TournamentRegistration::getTeam)
                .collect(java.util.stream.Collectors.toList());

        if (teams.size() < 2) {
            throw new BusinessException("São necessários pelo menos 2 times aprovados para gerar o chaveamento.");
        }

        Collections.shuffle(teams);

        int totalRounds = (int) Math.ceil(Math.log(teams.size()) / Math.log(2));
        int firstRoundSlots = (int) Math.pow(2, totalRounds);

        List<Match> matches = new ArrayList<>();

        for (int pos = 0; pos < firstRoundSlots / 2; pos++) {
            Match match = new Match();
            match.setTournament(tournament);
            match.setRound(1);
            match.setPosition(pos + 1);

            int homeIdx = pos * 2;
            int awayIdx = pos * 2 + 1;

            if (homeIdx < teams.size()) match.setHomeTeam(teams.get(homeIdx));
            if (awayIdx < teams.size()) match.setAwayTeam(teams.get(awayIdx));

            matches.add(match);
        }

        for (int round = 2; round <= totalRounds; round++) {
            int matchesInRound = (int) Math.pow(2, totalRounds - round);
            for (int pos = 1; pos <= matchesInRound; pos++) {
                Match match = new Match();
                match.setTournament(tournament);
                match.setRound(round);
                match.setPosition(pos);
                matches.add(match);
            }
        }

        matchRepository.saveAll(matches);
        tournament.setStatus("in_progress");
        tournamentRepository.save(tournament);

        return matches.stream().map(MatchResponseDTO::from).toList();
    }

    public List<MatchResponseDTO> listByTournament(String tournamentId) {
        return matchRepository.findByTournamentIdOrderByRoundAscPositionAsc(tournamentId).stream()
                .map(MatchResponseDTO::from)
                .toList();
    }

    @Transactional
    public MatchResponseDTO updateResult(String matchId, UpdateMatchResultDTO dto, User user) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new EntityNotFoundException("Partida não encontrada"));

        if (!match.getTournament().getOrganizer().getId().equals(user.getId())) {
            throw new BusinessException("Somente o organizador pode registrar resultados.");
        }

        match.setHomeScore(dto.homeScore());
        match.setAwayScore(dto.awayScore());
        match.setStatus("finished");

        Team winner = null;
        if (dto.homeScore() > dto.awayScore()) {
            winner = match.getHomeTeam();
        } else if (dto.awayScore() > dto.homeScore()) {
            winner = match.getAwayTeam();
        }
        match.setWinner(winner);
        matchRepository.save(match);

        // Propaga o vencedor para a próxima rodada
        if (winner != null) {
            final int nextRound = match.getRound() + 1;
            final int nextPosition = (int) Math.ceil(match.getPosition() / 2.0);
            final boolean isOddSlot = match.getPosition() % 2 != 0;
            final Team finalWinner = winner;

            matchRepository
                .findByTournamentIdAndRoundAndPosition(match.getTournament().getId(), nextRound, nextPosition)
                .ifPresent(next -> {
                    if (isOddSlot) {
                        next.setHomeTeam(finalWinner);
                    } else {
                        next.setAwayTeam(finalWinner);
                    }
                    matchRepository.save(next);
                });

            // Se não há próxima rodada, este é o jogo final — finaliza o torneio
            boolean haNextRound = matchRepository
                .findByTournamentIdAndRoundAndPosition(match.getTournament().getId(), nextRound, nextPosition)
                .isPresent();
            if (!haNextRound) {
                Tournament t = match.getTournament();
                t.setStatus("finished");
                tournamentRepository.save(t);
            }
        }

        return MatchResponseDTO.from(match);
    }
}
