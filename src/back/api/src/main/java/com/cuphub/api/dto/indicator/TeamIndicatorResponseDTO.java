package com.cuphub.api.dto.indicator;

public record TeamIndicatorResponseDTO(
    double aproveitamentoTime,
    long totalVitorias,
    long totalPartidas,
    double taxaAceitacaoConvites,
    long totalConvitesAceitos,
    long totalConvitesEnviados
) {}
