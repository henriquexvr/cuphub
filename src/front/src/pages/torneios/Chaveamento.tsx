import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import { useParams } from "react-router-dom"
import api from "../../service/api"
import type { Match } from "../../types/tournament"
import { BracketView } from "../../components/BracketView"
import { Trophy } from "lucide-react"
import TeamName from "../../components/TeamName"

type TorneioInfo = {
  id: string
  name: string
  status: string
  organizer?: { id: string; name: string }
}

export default function Chaveamento() {
  const { id } = useParams<{ id: string }>()
  const userId = localStorage.getItem("cuphub-user-id") ?? ""

  const [torneio, setTorneio] = useState<TorneioInfo | null>(null)
  const [partidas, setPartidas] = useState<Match[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState("")

  // modal de resultado
  const [modalPartida, setModalPartida] = useState<Match | null>(null)
  const [homeScore, setHomeScore] = useState("")
  const [awayScore, setAwayScore] = useState("")
  const [salvando, setSalvando] = useState(false)
  const [erroModal, setErroModal] = useState("")

  function carregarDados() {
    if (!id) return
    Promise.all([
      api.get(`/api/tournaments/${id}`),
      api.get(`/api/tournaments/${id}/matches`),
    ]).then(([tRes, pRes]) => {
      setTorneio(tRes.data)
      setPartidas(pRes.data)
    }).catch(() => setErro("Erro ao carregar chaveamento."))
      .finally(() => setCarregando(false))
  }

  useEffect(() => { carregarDados() }, [id])

  const souOrganizador = !!(torneio?.organizer?.id && torneio.organizer.id === userId)

  function abrirModal(partida: Match) {
    setModalPartida(partida)
    setHomeScore(String(partida.homeScore ?? ""))
    setAwayScore(String(partida.awayScore ?? ""))
    setErroModal("")
  }

  async function handleSalvarResultado(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!modalPartida) return
    const home = parseInt(homeScore)
    const away = parseInt(awayScore)
    if (isNaN(home) || isNaN(away) || home < 0 || away < 0) {
      setErroModal("Informe placares v\u00e1lidos (n\u00fameros inteiros \u2265 0).")
      return
    }
    setSalvando(true)
    setErroModal("")
    try {
      await api.patch(`/api/matches/${modalPartida.id}/result`, { homeScore: home, awayScore: away })
      setModalPartida(null)
      carregarDados()
    } catch (e: any) {
      setErroModal(e.response?.data?.message ?? "Erro ao salvar resultado.")
    } finally {
      setSalvando(false)
    }
  }

  if (carregando) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Carregando chaveamento...</p>
      </main>
    )
  }

  const maxRound = partidas.length > 0 ? Math.max(...partidas.map((p) => p.round)) : 0
  const final = partidas.find((p) => p.round === maxRound && p.status === "finished")
  const campeao = final?.winnerName
  const campeaoId = final?.winnerId

  return (
    <main>
      <section className="mx-auto max-w-6xl px-6 py-8">
        {erro && (
          <p className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{erro}</p>
        )}

        {torneio?.status === "finished" && campeao && (
          <div className="mb-8 rounded-2xl border border-yellow-500/40 bg-yellow-500/10 px-8 py-6 text-center shadow-sm">
            <p className="flex items-center justify-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-yellow-600">
              <Trophy className="h-4 w-4" /> Campeão do torneio
            </p>
            <p className="mt-2 text-4xl font-extrabold tracking-tight">
              <TeamName teamId={campeaoId} name={campeao} />
            </p>
            <div className="mt-2 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <span>{torneio.name}</span>
              <span className="rounded-full border border-border px-2.5 py-0.5 text-xs font-medium text-muted-foreground">Finalizado</span>
            </div>
          </div>
        )}

        {partidas.length === 0 && !erro ? (
          <div className="py-16 text-center text-muted-foreground">
            <p className="text-lg">O chaveamento ainda n\u00e3o foi gerado.</p>
            <p className="mt-2 text-sm">O organizador do torneio precisa gerar o chaveamento.</p>
          </div>
        ) : (
          <>
            <BracketView matches={partidas} />

            {/* Lista de partidas pendentes para o organizador registrar placar */}
            {souOrganizador && (
              <div className="mt-8">
                <h2 className="mb-4 text-lg font-bold">Registrar resultados</h2>
                {partidas.filter((p) => p.status === "scheduled" && p.homeTeamId && p.awayTeamId).length === 0 ? (
                  <p className="text-sm text-muted-foreground">Todas as partidas foram finalizadas.</p>
                ) : (
                  <div className="space-y-2">
                    {partidas
                      .filter((p) => p.status === "scheduled" && p.homeTeamId && p.awayTeamId)
                      .sort((a, b) => a.round - b.round || a.position - b.position)
                      .map((p) => (
                        <div key={p.id} className="flex items-center justify-between rounded-xl border bg-card px-4 py-3">
                          <span className="text-sm">
                            <span className="font-medium">{p.homeTeamName}</span>
                            <span className="mx-2 text-muted-foreground">&times;</span>
                            <span className="font-medium">{p.awayTeamName}</span>
                            <span className="ml-3 text-xs text-muted-foreground">Rodada {p.round}</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => abrirModal(p)}
                            className="rounded-xl border px-4 py-2 text-sm font-medium transition hover:bg-accent"
                          >
                            Registrar placar
                          </button>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </section>

      {/* Modal de registro de placar */}
      {modalPartida && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <section className="w-full max-w-sm rounded-2xl border bg-card p-6 shadow-xl">
            <h2 className="mb-1 text-lg font-bold">Registrar resultado</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              {modalPartida.homeTeamName} &times; {modalPartida.awayTeamName}
            </p>
            <form onSubmit={handleSalvarResultado} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {modalPartida.homeTeamName}
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={homeScore}
                    onChange={(e) => setHomeScore(e.target.value)}
                    className="w-full rounded-xl border bg-background px-4 py-3 text-center text-2xl font-bold outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {modalPartida.awayTeamName}
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={awayScore}
                    onChange={(e) => setAwayScore(e.target.value)}
                    className="w-full rounded-xl border bg-background px-4 py-3 text-center text-2xl font-bold outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
              {erroModal && (
                <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {erroModal}
                </p>
              )}
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setModalPartida(null)}
                  className="flex-1 rounded-xl border px-4 py-3 text-sm font-semibold transition hover:bg-accent"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={salvando}
                  className="flex-1 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
                >
                  {salvando ? "Salvando..." : "Confirmar"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  )
}
