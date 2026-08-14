package com.cuphub.api.service;

import com.cuphub.api.dto.tournament.TournamentDTO;
import com.cuphub.api.entity.Tournament;
import com.cuphub.api.entity.User;
import com.cuphub.api.repository.TournamentRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TournamentService {

    private final TournamentRepository repository;
    private final EmailService emailService;

    public Tournament create(TournamentDTO dto, User organizer) {
        Tournament t = new Tournament();
        t.setName(dto.name());
        t.setDescription(dto.description());
        t.setBannerUrl(dto.bannerUrl());
        t.setStartDate(dto.startDate());
        t.setEndDate(dto.endDate());
        t.setMaxTeams(dto.maxTeams() != null ? dto.maxTeams() : 8);
        t.setPointsWin(dto.pointsWin() != null ? dto.pointsWin() : 3);
        t.setPointsDraw(dto.pointsDraw() != null ? dto.pointsDraw() : 1);
        t.setPointsLoss(dto.pointsLoss() != null ? dto.pointsLoss() : 0);
        t.setNotes(dto.notes());
        t.setStatus("pending_approval");
        t.setOrganizer(organizer);
        return repository.save(t);
    }

    public List<Tournament> listAll() {
        return repository.findAll();
    }

    public Tournament getById(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Torneio não encontrado"));
    }

    public List<Tournament> listPending() {
        return repository.findByStatus("pending_approval");
    }

    @Transactional
    public Tournament updateStatus(String id, String status, String rejectionReason) {
        Tournament t = getById(id);
        t.setStatus(status);
        if ("rejected".equals(status) && rejectionReason != null && !rejectionReason.isBlank()) {
            t.setRejectionReason(rejectionReason);
        }
        Tournament saved = repository.save(t);
        try {
            if ("approved".equals(status)) {
                emailService.sendTournamentApproved(
                    t.getOrganizer().getEmail(), t.getOrganizer().getName(), t.getName());
            } else if ("rejected".equals(status)) {
                emailService.sendTournamentRejected(
                    t.getOrganizer().getEmail(), t.getOrganizer().getName(), t.getName(), rejectionReason);
            }
        } catch (Exception ignored) {}
        return saved;
    }

    @Transactional
    public Tournament update(String id, TournamentDTO dto) {
        Tournament t = getById(id);
        t.setName(dto.name());
        t.setDescription(dto.description());
        t.setBannerUrl(dto.bannerUrl());
        t.setStartDate(dto.startDate());
        t.setEndDate(dto.endDate());
        t.setMaxTeams(dto.maxTeams());
        t.setNotes(dto.notes());
        return repository.save(t);
    }

    @Transactional
    public void delete(String id) {
        repository.deleteById(id);
    }
}
