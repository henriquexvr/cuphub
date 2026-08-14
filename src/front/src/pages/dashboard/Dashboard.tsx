import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import api from "../../service/api"
import type { Tournament } from "../../types/tournament"
import { STATUS_LABELS, STATUS_COLORS } from "../../types/tournament"
import { formatarData } from "../../lib/format"
import TeamName from "../../components/TeamName"
import IndicatorCard from "../../components/IndicatorCard"
import type { OrganizerIndicator } from "../../types/indicator"

type Team = {
  id: string; name: string; captainId: string; captainName: string
  members: { userId: string; userName: string; role: string }[]
}

export default function Dashboard() {
  const role = localStorage.getItem("cuphub-user-role") ?? "participant"
  const meuId = localStorage.getItem("cuphub-user-id") ?? ""
  const [torneios, setTorneios] = useState<Tournament[]>([])
  const [meusTimes, setMeusTimes] = useState<Team[]>([])
  const [carregando, setCarregando] = useState(true)
  const [excluindoId, setExcluindoId] = useState<string | null>(null)
  const [indicadores, setIndicadores] = useState<OrganizerIndicator | null>(null)

  async function handleExcluirTime(id: string, nome: string) {
    if (!confirm(`Excluir o time "${nome}"?`)) return
    setExcluindoId(id)
    try {
      await api.delete(`/api/teams/${id}`)
      setMeusTimes((prev) => prev.filter((t) => t.id !== id))
    } catch {
      alert("Erro ao excluir time.")
    } finally {
      setExcluindoId(null)
    }
  }

  useEffect(() => {
    if (role !== "organizer" && role !== "admin") return
    api.get<OrganizerIndicator>("/api/indicators/organizer/me")
      .then((res) => setIndicadores(res.data))
      .catch(() => {})
  }, [role])

  useEffect(() => {
    Promise.all([
      api.get("/api/tournaments").catch(() => ({ data: [] })),
      api.get("/api/teams/mine").catch(() => ({ data: [] })),
    ]).then(([tRes, timesRes]) => {
      setTorneios(tRes.data.slice(0, 6))
      setMeusTimes(timesRes.data.slice(0, 4))
    }).finally(() => setCarregando(false))
  }, [])

  const torneiosAtivos = torneios.filter((t) => t.status === "registration_open" || t.status === "in_progress")

  return (
    <main>
      <section className="mx-auto max-w-6xl px-6 py-8 space-y-10">
        {carregando ? (
          <p className="text-muted-foreground">Carregando...</p>
        ) : (
          <>
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold">Meus times</h2>
                <Link to="/times" className="text-sm text-muted-foreground underline hover:text-foreground">Ver todos</Link>
              </div>
              {meusTimes.length === 0 ? (
                <div className="rounded-2xl border bg-card p-6 text-center text-muted-foreground">
                  Você ainda não faz parte de nenhum time.{" "}
                  <Link to="/times/criar" className="underline text-foreground font-medium">Criar time</Link>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {meusTimes.map((time) => {
                    const souCapitao = time.captainId === meuId
                    return (
                      <div key={time.id}
                        className="rounded-2xl border bg-card p-5">
                        <h3 className="font-bold"><TeamName teamId={time.id} name={time.name} /></h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Capitão: {time.captainName} &middot; {time.members.length} membro{time.members.length !== 1 ? "s" : ""}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Link
                            to={`/times/${time.id}`}
                            className="rounded-xl border px-3 py-1.5 text-xs font-medium transition hover:bg-accent"
                          >
                            Ver detalhes
                          </Link>
                          {souCapitao && (
                            <>
                              <Link
                                to={`/times/${time.id}/editar`}
                                className="rounded-xl border px-3 py-1.5 text-xs font-medium transition hover:bg-accent"
                              >
                                Editar
                              </Link>
                              <button
                                type="button"
                                onClick={() => handleExcluirTime(time.id, time.name)}
                                disabled={excluindoId === time.id}
                                className="rounded-xl border border-destructive/30 px-3 py-1.5 text-xs font-medium text-destructive transition hover:bg-destructive/10 disabled:opacity-50"
                              >
                                {excluindoId === time.id ? "Excluindo..." : "Excluir"}
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold">Minhas inscrições</h2>
                <Link to="/dashboard/inscricoes" className="text-sm text-muted-foreground underline hover:text-foreground">Ver todas</Link>
              </div>
              <Link to="/dashboard/inscricoes"
                className="block rounded-2xl border bg-card p-5 transition hover:-translate-y-0.5 hover:shadow-md">
                <p className="font-medium">Acompanhe o status das inscrições dos seus times nos torneios</p>
                <p className="mt-1 text-sm text-muted-foreground">Ver inscrições &#8594;</p>
              </Link>
            </div>

            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold">Torneios ativos</h2>
                <Link to="/torneios" className="text-sm text-muted-foreground underline hover:text-foreground">Ver todos</Link>
              </div>
              {torneiosAtivos.length === 0 ? (
                <div className="rounded-2xl border bg-card p-6 text-center text-muted-foreground">Nenhum torneio ativo no momento.</div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {torneiosAtivos.map((t) => (
                    <Link key={t.id} to={`/torneios/${t.id}`}
                      className="rounded-2xl border bg-card p-5 transition hover:-translate-y-0.5 hover:shadow-md">
                      <div className="mb-2 flex items-start justify-between gap-2">
                        <h3 className="font-bold">{t.name}</h3>
                        <span className={`rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap ${STATUS_COLORS[t.status]}`}>{STATUS_LABELS[t.status]}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Até {formatarData(t.endDate)} &middot; {t.maxTeams} times</p>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {(role === "organizer" || role === "admin") && indicadores && indicadores.totalTorneios > 0 && (
              <div>
                <h2 className="mb-4 text-xl font-bold">Indicadores dos meus torneios</h2>
                <div className="grid gap-4 md:grid-cols-3">
                  <IndicatorCard
                    title="Preenchimento médio de vagas"
                    value={`${indicadores.taxaPreenchimentoMedia.toFixed(1)}%`}
                    subtitle={`Média de ${indicadores.totalTorneios} torneio${indicadores.totalTorneios !== 1 ? "s" : ""}`}
                    color="text-blue-600"
                  />
                  <IndicatorCard
                    title="Conclusão média de partidas"
                    value={`${indicadores.taxaConclusaoMedia.toFixed(1)}%`}
                    color="text-amber-600"
                  />
                  <IndicatorCard
                    title="Aprovação média de inscrições"
                    value={`${indicadores.taxaAprovacaoMedia.toFixed(1)}%`}
                    color="text-emerald-600"
                  />
                </div>
              </div>
            )}

            {(role === "organizer" || role === "admin") && (
              <div>
                <h2 className="mb-4 text-xl font-bold">Ações rápidas</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <Link to="/torneios"
                    className="rounded-2xl border bg-card p-5 transition hover:-translate-y-0.5 hover:shadow-md">
                    <h3 className="font-bold">Criar torneio</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Crie um novo torneio e submeta para aprovação.</p>
                  </Link>
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  )
}
