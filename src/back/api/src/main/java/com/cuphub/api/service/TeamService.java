package com.cuphub.api.service;

import com.cuphub.api.exception.BusinessException;
import com.cuphub.api.exception.EntityNotFoundException;
import com.cuphub.api.dto.team.CreateTeamDTO;
import com.cuphub.api.dto.team.InviteResponseDTO;
import com.cuphub.api.dto.team.TeamResponseDTO;
import com.cuphub.api.dto.team.UpdateTeamDTO;
import com.cuphub.api.entity.Team;
import com.cuphub.api.entity.TeamInvite;
import com.cuphub.api.entity.TeamMember;
import com.cuphub.api.entity.User;
import com.cuphub.api.repository.TeamInviteRepository;
import com.cuphub.api.repository.TeamMemberRepository;
import com.cuphub.api.repository.TeamRepository;
import com.cuphub.api.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TeamService {

    private final TeamRepository teamRepository;
    private final TeamMemberRepository memberRepository;
    private final TeamInviteRepository inviteRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    @Transactional
    public TeamResponseDTO create(CreateTeamDTO dto, User captain) {
        Team team = new Team();
        team.setName(dto.name());
        team.setDescription(dto.description());
        team.setBannerUrl(dto.bannerUrl());
        team.setCaptain(captain);
        teamRepository.save(team);

        TeamMember captainMember = new TeamMember();
        captainMember.setTeam(team);
        captainMember.setUser(captain);
        captainMember.setRole("captain");
        memberRepository.save(captainMember);

        return TeamResponseDTO.from(teamRepository.findById(team.getId()).orElseThrow());
    }

    public List<TeamResponseDTO> listAll() {
        return teamRepository.findAll().stream()
                .map(TeamResponseDTO::from)
                .toList();
    }

    public TeamResponseDTO getById(String id) {
        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Time não encontrado"));
        return TeamResponseDTO.from(team);
    }

    @Transactional
    public TeamResponseDTO update(String id, UpdateTeamDTO dto, User requestingUser) {
        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Time não encontrado"));
        if (!team.getCaptain().getId().equals(requestingUser.getId())) {
            throw new BusinessException("Somente o capitão pode editar o time.");
        }
        team.setName(dto.name());
        team.setDescription(dto.description());
        team.setBannerUrl(dto.bannerUrl());
        teamRepository.save(team);
        return TeamResponseDTO.from(team);
    }

    public List<TeamResponseDTO> listMyTeams(String userId) {
        return memberRepository.findByUserId(userId).stream()
                .map(m -> TeamResponseDTO.from(m.getTeam()))
                .toList();
    }

    @Transactional
    public InviteResponseDTO sendInvite(String teamId, String invitedEmail, User requestingUser) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new EntityNotFoundException("Time não encontrado"));

        if (!team.getCaptain().getId().equals(requestingUser.getId())) {
            throw new BusinessException("Somente o capitão pode convidar membros.");
        }

        if (memberRepository.existsByTeamIdAndUserId(teamId,
                userRepository.findByEmail(invitedEmail).map(User::getId).orElse(""))) {
            throw new BusinessException("Usuário já é membro do time.");
        }

        if (inviteRepository.existsByTeamIdAndInvitedEmailAndStatus(teamId, invitedEmail, "pending")) {
            throw new BusinessException("Já existe um convite pendente para este e-mail.");
        }

        TeamInvite invite = new TeamInvite();
        invite.setTeam(team);
        invite.setInvitedEmail(invitedEmail);
        invite.setStatus("pending");
        inviteRepository.save(invite);

        emailService.sendTeamInvite(invitedEmail, team.getName(), requestingUser.getName(), invite.getToken());

        return InviteResponseDTO.from(invite);
    }

    @Transactional
    public TeamResponseDTO acceptInvite(String token, User user) {
        TeamInvite invite = inviteRepository.findByToken(token)
                .orElseThrow(() -> new EntityNotFoundException("Convite não encontrado."));

        if (!invite.getInvitedEmail().equalsIgnoreCase(user.getEmail())) {
            throw new BusinessException("Este convite não é para o seu e-mail.");
        }

        if (!invite.getStatus().equals("pending")) {
            throw new BusinessException("Este convite não está mais pendente.");
        }

        if (invite.getExpiresAt().isBefore(LocalDateTime.now())) {
            invite.setStatus("expired");
            inviteRepository.save(invite);
            throw new BusinessException("Este convite expirou.");
        }

        Team team = invite.getTeam();

        if (!memberRepository.existsByTeamIdAndUserId(team.getId(), user.getId())) {
            TeamMember member = new TeamMember();
            member.setTeam(team);
            member.setUser(user);
            member.setRole("member");
            memberRepository.save(member);
        }

        invite.setStatus("accepted");
        inviteRepository.save(invite);

        return TeamResponseDTO.from(teamRepository.findById(team.getId()).orElseThrow());
    }

    @Transactional
    public void rejectInvite(String token, User user) {
        TeamInvite invite = inviteRepository.findByToken(token)
                .orElseThrow(() -> new EntityNotFoundException("Convite não encontrado."));

        if (!invite.getInvitedEmail().equalsIgnoreCase(user.getEmail())) {
            throw new BusinessException("Este convite não é para o seu e-mail.");
        }

        if (!invite.getStatus().equals("pending")) {
            throw new BusinessException("Este convite não está mais pendente.");
        }

        invite.setStatus("rejected");
        inviteRepository.save(invite);
    }

    public InviteResponseDTO getInviteByToken(String token) {
        TeamInvite invite = inviteRepository.findByToken(token)
                .orElseThrow(() -> new EntityNotFoundException("Convite não encontrado."));
        return InviteResponseDTO.from(invite);
    }

    @Transactional
    public void delete(String teamId, User requestingUser) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new EntityNotFoundException("Time não encontrado"));
        boolean ehCapitao = team.getCaptain().getId().equals(requestingUser.getId());
        boolean ehAdmin = "admin".equals(requestingUser.getRole());
        if (!ehCapitao && !ehAdmin) {
            throw new BusinessException("Somente o capitão ou um administrador pode excluir o time.");
        }
        teamRepository.delete(team);
    }
}
