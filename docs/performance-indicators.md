## 5. Indicadores de desempenho

A tabela a seguir apresenta os principais indicadores de desempenho do sistema CupHub, organizados por área de interesse.

### Engajamento e participação

| **Indicador** | **Objetivos** | **Descrição** | **Fonte de dados** | **Fórmula de cálculo** |
| --- | --- | --- | --- | --- |
| Taxa de preenchimento de vagas | Medir o interesse dos participantes nos torneios | Percentual de vagas preenchidas em relação ao número máximo de times permitido | Tabela tournament_registrations (inscrições com status approved) e tabela tournaments (max_teams) | (número de inscrições aprovadas / max_teams do torneio) * 100 |
| Taxa de aceitação de convites | Avaliar o engajamento dos convidados para integrar times | Percentual de convites de time aceitos em relação ao total de convites enviados | Tabela team_invites | (número de convites com status accepted / número total de convites) * 100 |

### Qualidade do processo

| **Indicador** | **Objetivos** | **Descrição** | **Fonte de dados** | **Fórmula de cálculo** |
| --- | --- | --- | --- | --- |
| Taxa de aprovação de inscrições | Medir a eficiência dos organizadores na análise de solicitações | Percentual de inscrições aprovadas em relação ao total de inscrições recebidas | Tabela tournament_registrations | (número de inscrições com status approved / número total de inscrições) * 100 |
| Taxa de conclusão de partidas | Verificar se as partidas estão sendo efetivamente realizadas e finalizadas | Percentual de partidas finalizadas em relação ao total de partidas criadas | Tabela matches | (número de partidas com status finished / número total de partidas) * 100 |

### Desempenho dos participantes

| **Indicador** | **Objetivos** | **Descrição** | **Fonte de dados** | **Fórmula de cálculo** |
| --- | --- | --- | --- | --- |
| Aproveitamento médio dos times | Medir o desempenho geral dos times nos torneios | Percentual médio de vitórias em relação ao total de partidas disputadas por cada time | Tabela matches (winner_id, home_team_id, away_team_id) e tabela tournament_registrations | (número total de vitórias do time / número total de partidas disputadas pelo time) * 100 |
