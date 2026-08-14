package com.cuphub.api.repository;

import com.cuphub.api.entity.TeamMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TeamMemberRepository extends JpaRepository<TeamMember, String> {
    List<TeamMember> findByUserId(String userId);
    boolean existsByTeamIdAndUserId(String teamId, String userId);
    Optional<TeamMember> findByTeamIdAndUserId(String teamId, String userId);
}
