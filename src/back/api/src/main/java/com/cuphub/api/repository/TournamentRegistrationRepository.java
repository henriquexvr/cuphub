package com.cuphub.api.repository;

import com.cuphub.api.entity.TournamentRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TournamentRegistrationRepository extends JpaRepository<TournamentRegistration, String> {
    List<TournamentRegistration> findByTournamentId(String tournamentId);
    List<TournamentRegistration> findByTeamId(String teamId);
    boolean existsByTournamentIdAndTeamId(String tournamentId, String teamId);
    long countByTournamentIdAndStatus(String tournamentId, String status);
    List<TournamentRegistration> findByTeamIdIn(List<String> teamIds);

    @Query("SELECT COUNT(tr) FROM TournamentRegistration tr WHERE tr.tournament.id = :tournamentId")
    long countByTournamentId(@Param("tournamentId") String tournamentId);

    @Query("SELECT COUNT(tr) FROM TournamentRegistration tr WHERE tr.status = :status")
    long countAllByStatus(@Param("status") String status);
}
