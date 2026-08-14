package com.cuphub.api.repository;

import com.cuphub.api.entity.Team;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TeamRepository extends JpaRepository<Team, String> {
    List<Team> findByCaptainId(String captainId);
}
