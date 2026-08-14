package com.cuphub.api.repository;

import com.cuphub.api.entity.TeamInvite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface TeamInviteRepository extends JpaRepository<TeamInvite, String> {
    Optional<TeamInvite> findByToken(String token);
    boolean existsByTeamIdAndInvitedEmailAndStatus(String teamId, String email, String status);

    @Query("SELECT COUNT(ti) FROM TeamInvite ti")
    long countAll();

    @Query("SELECT COUNT(ti) FROM TeamInvite ti WHERE ti.status = :status")
    long countAllByStatus(@Param("status") String status);

    long countByTeamId(String teamId);
    long countByTeamIdAndStatus(String teamId, String status);
}
