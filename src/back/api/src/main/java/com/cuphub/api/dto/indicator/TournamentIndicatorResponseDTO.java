package com.cuphub.api.dto.indicator;

public record TournamentIndicatorResponseDTO(
    double taxaPreenchimentoVagas,
    long inscricoesAprovadas,
    long maxTimes,
    double taxaConclusaoPartidas,
    long partidasFinalizadas,
    long totalPartidas,
    double taxaAprovacaoInscricoes,
    long totalInscricoes
) {}
