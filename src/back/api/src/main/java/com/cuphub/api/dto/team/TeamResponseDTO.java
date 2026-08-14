package com.cuphub.api.dto.team;

import com.cuphub.api.entity.Team;

import java.time.LocalDateTime;
import java.util.List;

public record TeamResponseDTO(
    String id,
    String name,
    String description,
    String bannerUrl,
    String captainId,
    String captainName,
    List<MemberDTO> members,
    LocalDateTime createdAt
) {
    public record MemberDTO(String userId, String userName, String role) {}

    public static TeamResponseDTO from(Team team) {
        List<MemberDTO> members = team.getMembers().stream()
            .map(m -> new MemberDTO(m.getUser().getId(), m.getUser().getName(), m.getRole()))
            .toList();
        return new TeamResponseDTO(
            team.getId(),
            team.getName(),
            team.getDescription(),
            team.getBannerUrl(),
            team.getCaptain().getId(),
            team.getCaptain().getName(),
            members,
            team.getCreatedAt()
        );
    }
}
