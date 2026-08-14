package com.cuphub.api.dto.indicator;

public record IndicatorResponseDTO(
    // Engajamento
    double taxaPreenchimentoVagas,
    double taxaAceitacaoConvites,

    // Qualidade do processo
    double taxaAprovacaoInscricoes,
    double taxaConclusaoPartidas,

    // Desempenho dos participantes
    double aproveitamentoMedioTimes,

    // Contagens brutas para contexto
    long totalInscricoesAprovadas,
    long totalMaxVagas,
    long totalConvitesAceitos,
    long totalConvitesEnviados,
    long totalInscricoesAprovadas2,
    long totalInscricoes,
    long totalPartidasFinalizadas,
    long totalPartidas,
    long totalTimesComPartidas
) {}