import { useEffect, useState } from "react"
import api from "../../service/api"
import type { IndicatorData } from "../../types/indicator"
import IndicatorCard from "../../components/IndicatorCard"

export default function Indicadores() {
  const [data, setData] = useState<IndicatorData | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    api.get<IndicatorData>("/api/indicators")
      .then((res) => setData(res.data))
      .catch(() => setErro("Erro ao carregar indicadores."))
      .finally(() => setCarregando(false))
  }, [])

  if (carregando) {
    return (
      <main>
        <section className="mx-auto max-w-6xl px-6 py-8">
          <p className="text-muted-foreground">Carregando indicadores...</p>
        </section>
      </main>
    )
  }

  if (erro || !data) {
    return (
      <main>
        <section className="mx-auto max-w-6xl px-6 py-8">
          <p className="text-destructive">{erro ?? "Nenhum dado disponível."}</p>
        </section>
      </main>
    )
  }

  return (
    <main>
      <section className="mx-auto max-w-6xl px-6 py-8 space-y-10">
        <div>
          <h1 className="text-2xl font-bold">Indicadores de Desempenho</h1>
          <p className="mt-1 text-muted-foreground">
            Métricas gerais de engajamento, qualidade e desempenho do sistema.
          </p>
        </div>

        <div>
          <h2 className="mb-4 text-lg font-semibold">Engajamento e Participação</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <IndicatorCard
              title="Taxa de Preenchimento de Vagas"
              value={`${data.taxaPreenchimentoVagas.toFixed(1)}%`}
              subtitle={`${data.totalInscricoesAprovadas} inscrições aprovadas de ${data.totalMaxVagas} vagas`}
              color="text-blue-600"
            />
            <IndicatorCard
              title="Taxa de Aceitação de Convites"
              value={`${data.taxaAceitacaoConvites.toFixed(1)}%`}
              subtitle={`${data.totalConvitesAceitos} aceitos de ${data.totalConvitesEnviados} enviados`}
              color="text-green-600"
            />
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-lg font-semibold">Qualidade do Processo</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <IndicatorCard
              title="Taxa de Aprovação de Inscrições"
              value={`${data.taxaAprovacaoInscricoes.toFixed(1)}%`}
              subtitle={`${data.totalInscricoesAprovadas2} aprovadas de ${data.totalInscricoes} totais`}
              color="text-emerald-600"
            />
            <IndicatorCard
              title="Taxa de Conclusão de Partidas"
              value={`${data.taxaConclusaoPartidas.toFixed(1)}%`}
              subtitle={`${data.totalPartidasFinalizadas} finalizadas de ${data.totalPartidas} criadas`}
              color="text-amber-600"
            />
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-lg font-semibold">Desempenho dos Participantes</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <IndicatorCard
              title="Aproveitamento Médio dos Times"
              value={`${data.aproveitamentoMedioTimes.toFixed(1)}%`}
              subtitle="Média de vitórias por partidas disputadas"
              color="text-purple-600"
            />
          </div>
        </div>
      </section>
    </main>
  )
}
