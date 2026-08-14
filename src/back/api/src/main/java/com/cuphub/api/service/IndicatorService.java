package com.cuphub.api.service;

import com.cuphub.api.dto.indicator.IndicatorResponseDTO;
import com.cuphub.api.dto.indicator.OrganizerIndicatorResponseDTO;
import com.cuphub.api.dto.indicator.TeamIndicatorResponseDTO;
import com.cuphub.api.dto.indicator.TournamentIndicatorResponseDTO;
import com.cuphub.api.entity.Tournament;
import java.util.List;
import com.cuphub.api.repository.MatchRepository;
import com.cuphub.api.repository.TeamInviteRepository;
import com.cuphub.api.repository.TournamentRegistrationRepository;
import com.cuphub.api.repository.TournamentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class IndicatorService {

    private final TournamentRegistrationRepository registrationRepository;
    private final MatchRepository matchRepository;
    private final TeamInviteRepository teamInviteRepository;
    private final TournamentRepository tournamentRepository;

    public IndicatorResponseDTO getIndicators() {
        // 1. Taxa de preenchimento de vagas
        long approvedRegistrations = registrationRepository.countAllByStatus("approved");
        long totalMaxTeams = registrationRepository.count();
        long totalMaxVagas = totalMaxTeams > 0 ? totalMaxTeams : 1;
        double taxaPreenchimento = (approvedRegistrations * 100.0) / totalMaxVagas;

        // 2. Taxa de aceitação de convites
        long acceptedInvites = teamInviteRepository.countAllByStatus("accepted");
        long totalInvites = teamInviteRepository.count();
        long totalInvitesSafe = totalInvites > 0 ? totalInvites : 1;
        double taxaAceitacao = (acceptedInvites * 100.0) / totalInvitesSafe;

        // 3. Taxa de aprovação de inscrições
        long approvedReg2 = registrationRepository.countAllByStatus("approved");
        long totalRegistrations = registrationRepository.count();
        long totalRegSafe = totalRegistrations > 0 ? totalRegistrations : 1;
        double taxaAprovacao = (approvedReg2 * 100.0) / totalRegSafe;

        // 4. Taxa de conclusão de partidas
        long finishedMatches = matchRepository.countAllByStatus("finished");
        long totalMatches = matchRepository.count();
        long totalMatchesSafe = totalMatches > 0 ? totalMatches : 1;
        double taxaConclusao = (finishedMatches * 100.0) / totalMatchesSafe;

        // 5. Aproveitamento médio dos times
        double aproveitamentoMedio = calculateAverageTeamPerformance();

        return new IndicatorResponseDTO(
            taxaPreenchimento,
            taxaAceitacao,
            taxaAprovacao,
            taxaConclusao,
            aproveitamentoMedio,
            approvedRegistrations,
            totalMaxTeams,
            acceptedInvites,
            totalInvites,
            approvedReg2,
            totalRegistrations,
            finishedMatches,
            totalMatches,
            0L
        );
    }

    public TeamIndicatorResponseDTO getTeamIndicators(String teamId) {
        long totalPlayed = 0L, wins = 0L;
        for (Object[] stat : matchRepository.getTeamPerformanceStats()) {
            if (teamId.equals(stat[0])) {
                totalPlayed = ((Number) stat[1]).longValue();
                wins = ((Number) stat[2]).longValue();
                break;
            }
        }
        double aproveitamento = totalPlayed > 0 ? (wins * 100.0) / totalPlayed : 0.0;

        long aceitos = teamInviteRepository.countByTeamIdAndStatus(teamId, "accepted");
        long enviados = teamInviteRepository.countByTeamId(teamId);
        double taxaAceitacao = enviados > 0 ? (aceitos * 100.0) / enviados : 0.0;

        return new TeamIndicatorResponseDTO(aproveitamento, wins, totalPlayed, taxaAceitacao, aceitos, enviados);
    }

    public TournamentIndicatorResponseDTO getTournamentIndicators(String tournamentId, com.cuphub.api.entity.User requester) {
        Tournament t = tournamentRepository.findById(tournamentId)
            .orElseThrow(() -> new IllegalArgumentException("Torneio não encontrado"));
        boolean ehDono = t.getOrganizer().getId().equals(requester.getId());
        boolean ehAdmin = "admin".equals(requester.getRole());
        if (!ehDono && !ehAdmin) {
            throw new com.cuphub.api.exception.BusinessException("Somente o organizador pode ver os indicadores deste torneio.");
        }
        return computeTournamentIndicators(tournamentId);
    }

    private TournamentIndicatorResponseDTO computeTournamentIndicators(String tournamentId) {
        Tournament t = tournamentRepository.findById(tournamentId)
            .orElseThrow(() -> new IllegalArgumentException("Torneio não encontrado"));

        long aprovadas = registrationRepository.countByTournamentIdAndStatus(tournamentId, "approved");
        long maxTimes = t.getMaxTeams() != null ? t.getMaxTeams() : 0L;
        double taxaPreenchimento = maxTimes > 0 ? (aprovadas * 100.0) / maxTimes : 0.0;

        long finalizadas = matchRepository.countByTournamentIdAndStatus(tournamentId, "finished");
        long totalPartidas = matchRepository.countByTournamentId(tournamentId);
        double taxaConclusao = totalPartidas > 0 ? (finalizadas * 100.0) / totalPartidas : 0.0;

        long totalInscricoes = registrationRepository.countByTournamentId(tournamentId);
        double taxaAprovacao = totalInscricoes > 0 ? (aprovadas * 100.0) / totalInscricoes : 0.0;

        return new TournamentIndicatorResponseDTO(
            taxaPreenchimento, aprovadas, maxTimes,
            taxaConclusao, finalizadas, totalPartidas,
            taxaAprovacao, totalInscricoes);
    }

    public OrganizerIndicatorResponseDTO getOrganizerIndicators(String organizerId) {
        List<Tournament> torneios = tournamentRepository.findByOrganizerId(organizerId);
        if (torneios.isEmpty()) {
            return new OrganizerIndicatorResponseDTO(0.0, 0.0, 0.0, 0);
        }
        double somaPreench = 0.0, somaConclusao = 0.0, somaAprovacao = 0.0;
        for (Tournament t : torneios) {
            TournamentIndicatorResponseDTO d = computeTournamentIndicators(t.getId());
            somaPreench += d.taxaPreenchimentoVagas();
            somaConclusao += d.taxaConclusaoPartidas();
            somaAprovacao += d.taxaAprovacaoInscricoes();
        }
        int n = torneios.size();
        return new OrganizerIndicatorResponseDTO(somaPreench / n, somaConclusao / n, somaAprovacao / n, n);
    }

    private double calculateAverageTeamPerformance() {
        java.util.List<Object[]> teamStats = matchRepository.getTeamPerformanceStats();
        if (teamStats.isEmpty()) return 0.0;

        double totalWinRate = 0.0;
        int count = 0;
        for (Object[] stat : teamStats) {
            long totalPlayed = ((Number) stat[1]).longValue();
            long wins = ((Number) stat[2]).longValue();
            if (totalPlayed > 0) {
                totalWinRate += (wins * 100.0) / totalPlayed;
                count++;
            }
        }
        return count > 0 ? totalWinRate / count : 0.0;
    }
}