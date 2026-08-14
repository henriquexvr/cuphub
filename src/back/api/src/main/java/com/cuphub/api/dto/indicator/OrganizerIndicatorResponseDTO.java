package com.cuphub.api.dto.indicator;

public record OrganizerIndicatorResponseDTO(
    double taxaPreenchimentoMedia,
    double taxaConclusaoMedia,
    double taxaAprovacaoMedia,
    int totalTorneios
) {}
