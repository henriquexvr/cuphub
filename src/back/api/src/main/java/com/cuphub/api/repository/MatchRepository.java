package com.cuphub.api.repository;

import com.cuphub.api.entity.Match;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MatchRepository extends JpaRepository<Match, String> {
    List<Match> findByTournamentIdOrderByRoundAscPositionAsc(String tournamentId);
    boolean existsByTournamentId(String tournamentId);
    void deleteByTournamentId(String tournamentId);
    java.util.Optional<Match> findByTournamentIdAndRoundAndPosition(String tournamentId, int round, int position);

    @Query("SELECT COUNT(m) FROM Match m WHERE m.tournament.id = :tournamentId")
    long countByTournamentId(@Param("tournamentId") String tournamentId);

    @Query("SELECT COUNT(m) FROM Match m WHERE m.tournament.id = :tournamentId AND m.status = :status")
    long countByTournamentIdAndStatus(@Param("tournamentId") String tournamentId, @Param("status") String status);

    @Query("SELECT COUNT(m) FROM Match m WHERE m.status = :status")
    long countAllByStatus(@Param("status") String status);

    @Query("SELECT COUNT(m) FROM Match m")
    long countAll();

    @Query(value = """
        SELECT team_id, SUM(total_played) as total_played, SUM(wins) as wins FROM (
            SELECT home_team_id as team_id, COUNT(*) as total_played,
                   SUM(CASE WHEN winner_id = home_team_id THEN 1 ELSE 0 END) as wins
            FROM matches WHERE home_team_id IS NOT NULL AND status = 'finished'
            GROUP BY home_team_id
            UNION ALL
            SELECT away_team_id as team_id, COUNT(*) as total_played,
                   SUM(CASE WHEN winner_id = away_team_id THEN 1 ELSE 0 END) as wins
            FROM matches WHERE away_team_id IS NOT NULL AND status = 'finished'
            GROUP BY away_team_id
        ) combined
        GROUP BY team_id
        """, nativeQuery = true)
    List<Object[]> getTeamPerformanceStats();
}
