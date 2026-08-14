package com.cuphub.api.repository;

import com.cuphub.api.entity.Tournament;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TournamentRepository extends JpaRepository<Tournament, String> {
    List<Tournament> findByStatus(String status);
    List<Tournament> findByOrganizerId(String organizerId);
}
