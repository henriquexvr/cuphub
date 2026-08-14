import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import api from "../../service/api"
import type { Tournament, Match } from "../../types/tournament"
import IndicatorCard from "../../components/IndicatorCard"
import type { TournamentIndicator } from "../../types/indicator"
import { STATUS_LABELS, STATUS_COLORS } from "../../types/tournament"
import { BracketView } from "../../components/BracketView"
import { formatarData } from "../../lib/format"
import TeamName from "../../components/TeamName"
import { Trophy } from "lucide-react"

type TeamSimples = { id: string; name: string; captainId: string }
type Registration = { id: string; teamId: string; teamName: string; status: string }

export default function TorneioDetalhe() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const userId = localStorage.getItem("cuphub-user-id") ?? ""
  const [torneio, setTorneio] = useState<Tournament | null>(null)
  const [meusTimes, setMeusTimes] = useState<TeamSimples[]>([])
  const [inscricoes, setInscricoes] = useState<Registration[]>([])
  const [timeSelecionado, setTimeSelecionado] = useState("")
  const [inscrevendo, setInscrevendo] = useState(false)
  const [mensagem, setMensagem] = useState("")
  const [carregando, setCarregando] = useState(true)
  const [gerandoBracket, setGerandoBracket] = useState(false)
  const [msgOrganizador, setMsgOrganizador] = useState("")
  const [processandoInscricao, setProcessandoInscricao] = useState<string | null>(null)
  const [partidas, setPartidas] = useState<Match[]>([])
  const [indicadores, setIndicadores] = useState<TournamentIndicator | null>(null)

  useEffect(() => {
    if (!id) return
    Promise.all([
      api.get(`/api/tournaments/${id}`),
      api.get("/api/teams/mine").catch(() => ({ data: [] })),
      api.get(`/api/tournaments/${id}/registrations`).catch(() => ({ data: [] })),
      api.get(`/api/tournaments/${id}/matches`).catch(() => ({ data: [] })),
    ]).then(([tRes, timesRes, inscRes, matchRes]) => {
      setTorneio(tRes.data); setMeusTimes(timesRes.data); setInscricoes(inscRes.data); setPartidas(matchRes.data)
    }).catch(() => navigate("/torneios")).finally(() => setCarregando(false))
  }, [id])

  const souOrganizador = !!(torneio?.organizer?.id && torneio.organizer.id === userId)

  useEffect(() => {
    if (!id || !torneio) return
    if (torneio.organizer?.id !== userId) return
    api.get<TournamentIndicator>(`/api/indicators/tournament/${id}`)
      .then((res) => setIndicadores(res.data))
      .catch(() => {})
  }, [id, torneio, userId])

  const timesJaInscritos = inscricoes.map((i) => i.teamId)
  const timesDisponiveis = meusTimes.filter((t) => t.captainId === userId && !timesJaInscritos.includes(t.id))

  async function handleInscrever() {
    if (!timeSelecionado || !id) return
    setInscrevendo(true); setMensagem("")
    try {
      await api.post(`/api/tournaments/${id}/registrations`, { teamId: timeSelecionado })
      const res = await api.get(`/api/tournaments/${id}/registrations`)
      setInscricoes(res.data); setMensagem("Inscrição enviada! Aguarde aprovação."); setTimeSelecionado("")
    } catch (e: any) { setMensagem(e.response?.data?.message ?? "Erro ao inscrever.") }
    finally { setInscrevendo(false) }
  }

  async function handleAbrirInscricoes() {
    if (!id) return
    try {
      await api.patch(`/api/tournaments/${id}/status?status=registration_open`)
      const res = await api.get(`/api/tournaments/${id}`)
      setTorneio(res.data); setMsgOrganizador("Inscrições abertas!")
    } catch (e: any) { setMsgOrganizador(e.response?.data?.message ?? "Erro.") }
  }

  async function handleGerarChaveamento() {
    if (!id) return
    setGerandoBracket(true); setMsgOrganizador("")
    try {
      await api.post(`/api/tournaments/${id}/bracket/generate`)
      navigate(`/torneios/${id}/chaveamento`)
    } catch (e: any) { setMsgOrganizador(e.response?.data?.message ?? "Erro ao gerar chaveamento.") }
    finally { setGerandoBracket(false) }
  }

  async function handleRevisarInscricao(inscricaoId: string, novoStatus: "approved" | "rejected") {
    setProcessandoInscricao(inscricaoId)
    setMsgOrganizador("")
    try {
      await api.patch(`/api/registrations/${inscricaoId}/review`, { status: novoStatus })
      const res = await api.get(`/api/tournaments/${id}/registrations`)
      setInscricoes(res.data)
      setMsgOrganizador(novoStatus === "approved" ? "Inscrição aprovada!" : "Inscrição recusada.")
    } catch (e: any) {
      const detail = e.response?.data?.message ?? e.response?.data?.error ?? e.message ?? "Erro ao revisar inscrição."
      setMsgOrganizador(typeof detail === "string" ? detail : "Erro ao revisar inscrição.")
    }
    finally { setProcessandoInscricao(null) }
  }

  if (carregando) return <main className="flex min-h-screen items-center justify-center"><p className="text-muted-foreground">Carregando torneio...</p></main>
  if (!torneio) return null

  return (
    <main>
      <section className="mx-auto max-w-4xl px-6 py-8">
        {torneio.bannerUrl && <img src={torneio.bannerUrl} alt={torneio.name} className="mb-6 h-48 w-full rounded-2xl border object-cover" />}
        <div className="mb-2 flex items-start justify-between gap-4">
          <h1 className="text-3xl font-bold">{torneio.name}</h1>
          <span className={`rounded-full border px-3 py-1 text-sm font-medium whitespace-nowrap ${STATUS_COLORS[torneio.status]}`}>{STATUS_LABELS[torneio.status]}</span>
        </div>
        {torneio.organizer && <p className="mt-3 text-sm text-muted-foreground">Organizador: {torneio.organizer.name}</p>}

        {torneio.status === "finished" && (() => {
          const maxRound = partidas.length > 0 ? Math.max(...partidas.map((p) => p.round)) : 0
          const campeaoMatch = partidas.find((p) => p.round === maxRound && p.status === "finished")
          return campeaoMatch?.winnerName ? (
            <div className="mt-5 rounded-2xl border border-yellow-500/40 bg-yellow-500/10 px-8 py-5 text-center">
              <p className="flex items-center justify-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-yellow-600"><Trophy className="h-4 w-4" /> Campeão</p>
              <p className="mt-1 text-3xl font-extrabold tracking-tight"><TeamName teamId={campeaoMatch.winnerId} name={campeaoMatch.winnerName} /></p>
            </div>
          ) : null
        })()}

        {torneio.description && <p className="mt-3 text-muted-foreground">{torneio.description}</p>}

        <div className="mt-6 grid gap-4 rounded-2xl border bg-card p-6 sm:grid-cols-3">
          <div><p className="text-sm text-muted-foreground">Início</p><p className="font-bold">{formatarData(torneio.startDate)}</p></div>
          <div><p className="text-sm text-muted-foreground">Término</p><p className="font-bold">{formatarData(torneio.endDate)}</p></div>
          <div><p className="text-sm text-muted-foreground">Times</p><p className="font-bold">{inscricoes.filter((i) => i.status === "approved").length} / {torneio.maxTeams}</p></div>
        </div>

        {torneio.notes && (
          <div className="mt-6 rounded-2xl border bg-card p-6">
            <h2 className="mb-2 font-bold">Regras e observações</h2>
            <p className="text-sm text-muted-foreground whitespace-pre-line">{torneio.notes}</p>
          </div>
        )}

        {souOrganizador && (
          <div className="mt-6 rounded-2xl border bg-card p-6">
            <h2 className="mb-4 font-bold">Controles do organizador</h2>
            <div className="flex flex-wrap gap-3">
              {torneio.status === "approved" && (
                <button type="button" onClick={handleAbrirInscricoes}
                  className="rounded-xl border px-5 py-3 text-sm font-semibold transition hover:bg-accent">Abrir inscrições</button>
              )}
              {(torneio.status === "registration_open" || torneio.status === "in_progress") && (
                <button type="button" onClick={handleGerarChaveamento} disabled={gerandoBracket}
                  className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50">
                  {gerandoBracket ? "Gerando..." : "Gerar chaveamento"}
                </button>
              )}
            </div>
            {msgOrganizador && <p className="mt-3 text-sm text-muted-foreground">{msgOrganizador}</p>}
          </div>
        )}

        {souOrganizador && indicadores && (
          <div className="mt-6">
            <h2 className="mb-4 font-bold">Indicadores do torneio</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <IndicatorCard
                title="Preenchimento de vagas"
                value={`${indicadores.taxaPreenchimentoVagas.toFixed(1)}%`}
                subtitle={`${indicadores.inscricoesAprovadas} de ${indicadores.maxTimes} vagas`}
                color="text-blue-600"
              />
              <IndicatorCard
                title="Conclusão de partidas"
                value={`${indicadores.taxaConclusaoPartidas.toFixed(1)}%`}
                subtitle={`${indicadores.partidasFinalizadas} de ${indicadores.totalPartidas} partidas`}
                color="text-amber-600"
              />
              <IndicatorCard
                title="Aprovação de inscrições"
                value={`${indicadores.taxaAprovacaoInscricoes.toFixed(1)}%`}
                subtitle={`${indicadores.inscricoesAprovadas} de ${indicadores.totalInscricoes} inscrições`}
                color="text-emerald-600"
              />
            </div>
          </div>
        )}

        {torneio.status === "registration_open" && timesDisponiveis.length > 0 && (
          <div className="mt-6 rounded-2xl border bg-card p-6">
            <h2 className="mb-4 font-bold">Inscrever time</h2>
            <div className="flex gap-3">
              <select value={timeSelecionado} onChange={(e) => setTimeSelecionado(e.target.value)}
                className="flex-1 rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring">
                <option value="">Selecione um time...</option>
                {timesDisponiveis.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
              <button type="button" onClick={handleInscrever} disabled={!timeSelecionado || inscrevendo}
                className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50">
                {inscrevendo ? "Inscrevendo..." : "Inscrever"}
              </button>
            </div>
            {mensagem && <p className="mt-3 text-sm text-muted-foreground">{mensagem}</p>}
          </div>
        )}

        {(torneio.status === "in_progress" || torneio.status === "finished") && partidas.length > 0 && (
          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-bold">Chaveamento</h2>
              <Link
                to={`/torneios/${id}/chaveamento`}
                className="text-sm text-muted-foreground transition hover:text-foreground"
              >
                Ver completo →
              </Link>
            </div>
            <BracketView matches={partidas} />
          </div>
        )}

        {inscricoes.length > 0 && (
          <div className="mt-6">
            <h2 className="mb-4 font-bold">Times inscritos ({inscricoes.length})</h2>
            <ul className="space-y-2">
              {inscricoes.map((i) => (
                <li key={i.id} className="flex items-center justify-between gap-3 rounded-xl border bg-card px-4 py-3">
                  <span className="font-medium"><TeamName teamId={i.teamId} name={i.teamName} /></span>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      i.status === "approved" ? "bg-green-500/15 text-green-600" :
                      i.status === "rejected" ? "bg-red-500/15 text-red-500" :
                      "bg-yellow-500/15 text-yellow-600"
                    }`}>
                      {i.status === "approved" ? "Aprovado" : i.status === "rejected" ? "Recusado" : "Pendente"}
                    </span>
                    {souOrganizador && i.status === "pending" && (
                      <>
                        <button type="button" onClick={() => handleRevisarInscricao(i.id, "approved")}
                          disabled={processandoInscricao === i.id}
                          className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-green-700 disabled:opacity-50">
                          Aprovar
                        </button>
                        <button type="button" onClick={() => handleRevisarInscricao(i.id, "rejected")}
                          disabled={processandoInscricao === i.id}
                          className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700 disabled:opacity-50">
                          Recusar
                        </button>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </main>
  )
}
