package com.cuphub.api.service;

import com.cuphub.api.dto.registration.CreateRegistrationDTO;
import com.cuphub.api.dto.registration.RegistrationResponseDTO;
import com.cuphub.api.dto.registration.ReviewRegistrationDTO;
import com.cuphub.api.entity.Team;
import com.cuphub.api.entity.Tournament;
import com.cuphub.api.entity.TournamentRegistration;
import com.cuphub.api.entity.User;
import com.cuphub.api.exception.BusinessException;
import com.cuphub.api.repository.TeamMemberRepository;
import com.cuphub.api.repository.TeamRepository;
import com.cuphub.api.repository.TournamentRegistrationRepository;
import com.cuphub.api.repository.TournamentRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RegistrationService {

    private final TournamentRegistrationRepository registrationRepository;
    private final TournamentRepository tournamentRepository;
    private final TeamRepository teamRepository;
    private final TeamMemberRepository memberRepository;
    private final EmailService emailService;

    @Transactional
    public RegistrationResponseDTO register(String tournamentId, CreateRegistrationDTO dto, User user) {
        Tournament tournament = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new BusinessException("Torneio não encontrado"));

        Team team = teamRepository.findById(dto.teamId())
                .orElseThrow(() -> new BusinessException("Time não encontrado"));

        if (!team.getCaptain().getId().equals(user.getId())) {
            throw new BusinessException("Somente o capitão pode inscrever o time.");
        }

        if (registrationRepository.existsByTournamentIdAndTeamId(tournamentId, dto.teamId())) {
            throw new BusinessException("Time já inscrito neste torneio.");
        }

        long approved = registrationRepository.countByTournamentIdAndStatus(tournamentId, "approved");
        if (approved >= tournament.getMaxTeams()) {
            throw new BusinessException("Torneio já atingiu o limite de times.");
        }

        TournamentRegistration reg = new TournamentRegistration();
        reg.setTournament(tournament);
        reg.setTeam(team);
        reg.setNotes(dto.notes());
        reg.setStatus("pending");
        registrationRepository.save(reg);

        try {
            emailService.sendNewRegistration(
                tournament.getOrganizer().getEmail(),
                tournament.getOrganizer().getName(),
                team.getName(),
                tournament.getName()
            );
        } catch (Exception ignored) {}

        return RegistrationResponseDTO.from(reg);
    }

    public List<RegistrationResponseDTO> listByTournament(String tournamentId) {
        return registrationRepository.findByTournamentId(tournamentId).stream()
                .map(RegistrationResponseDTO::from).toList();
    }

    public List<RegistrationResponseDTO> listByTeam(String teamId) {
        return registrationRepository.findByTeamId(teamId).stream()
                .map(RegistrationResponseDTO::from).toList();
    }

    public List<RegistrationResponseDTO> listByUser(User user) {
        List<String> teamIds = memberRepository.findByUserId(user.getId())
                .stream()
                .map(m -> m.getTeam().getId())
                .toList();

        if (teamIds.isEmpty()) return List.of();

        return registrationRepository.findByTeamIdIn(teamIds).stream()
                .map(RegistrationResponseDTO::from)
                .toList();
    }

    @Transactional
    public RegistrationResponseDTO review(String registrationId, ReviewRegistrationDTO dto, User user) {
        TournamentRegistration reg = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new BusinessException("Inscrição não encontrada"));

        if (!reg.getTournament().getOrganizer().getId().equals(user.getId())) {
            throw new BusinessException("Somente o organizador pode revisar inscrições.");
        }

        if (!dto.status().equals("approved") && !dto.status().equals("rejected")) {
            throw new BusinessException("Status inválido. Use 'approved' ou 'rejected'.");
        }

        reg.setStatus(dto.status());
        if (dto.status().equals("rejected") && dto.rejectionReason() != null) {
            reg.setRejectionReason(dto.rejectionReason());
        }
        registrationRepository.save(reg);

        try {
            String captainEmail = reg.getTeam().getCaptain().getEmail();
            String captainName = reg.getTeam().getCaptain().getName();
            String teamName = reg.getTeam().getName();
            String tournamentName = reg.getTournament().getName();

            if ("approved".equals(dto.status())) {
                emailService.sendRegistrationApproved(captainEmail, captainName, teamName, tournamentName);
            } else {
                emailService.sendRegistrationRejected(captainEmail, captainName, teamName, tournamentName, dto.rejectionReason());
            }
        } catch (Exception ignored) {}

        return RegistrationResponseDTO.from(reg);
    }
}
