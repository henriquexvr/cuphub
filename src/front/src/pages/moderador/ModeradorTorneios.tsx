import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import api from "../../service/api"
import { STATUS_LABELS, STATUS_COLORS, type TournamentStatus } from "../../types/tournament"
import { formatarData } from "../../lib/format"

type TorneioResumo = {
  id: string; name: string; description?: string; bannerUrl?: string
  startDate: string; endDate: string; maxTeams: number; status: TournamentStatus
  organizer?: { id: string; name: string }
}

type Filtro = "pending_approval" | "approved" | "all"

const FILTROS: { valor: Filtro; label: string }[] = [
  { valor: "pending_approval", label: "Aguardando" },
  { valor: "approved", label: "Aprovados" },
  { valor: "all", label: "Todos" },
]

export default function ModeradorTorneios() {
  const [todos, setTodos] = useState<TorneioResumo[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState("")
  const [filtro, setFiltro] = useState<Filtro>("pending_approval")

  useEffect(() => {
    api.get("/api/tournaments")
      .then((r) => setTodos(r.data))
      .catch(() => setErro("Erro ao carregar torneios."))
      .finally(() => setCarregando(false))
  }, [])

  const torneios = filtro === "all" ? todos : todos.filter((t) => t.status === filtro)

  return (
    <main>
      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-6 rounded-2xl border bg-card p-6 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">Gestão de torneios</p>
          <h2 className="mt-2 text-3xl font-bold">
            {carregando ? "..." : `${torneios.length} torneio${torneios.length !== 1 ? "s" : ""}`}
          </h2>
        </div>

        <div className="mb-6 flex gap-2">
          {FILTROS.map((f) => (
            <button key={f.valor} type="button" onClick={() => setFiltro(f.valor)}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                filtro === f.valor ? "bg-foreground text-background" : "border hover:bg-accent"
              }`}>
              {f.label}
            </button>
          ))}
        </div>

        {erro && <p className="mb-6 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{erro}</p>}

        {carregando ? <p className="text-muted-foreground">Carregando...</p>
          : torneios.length === 0 ? (
            <div className="rounded-2xl border bg-card p-8 text-center text-muted-foreground">
              Nenhum torneio com este filtro.
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {torneios.map((t) => (
                <article key={t.id} className="rounded-2xl border bg-card p-6 shadow-sm">
                  {t.bannerUrl ? <img src={t.bannerUrl} alt={t.name} className="mb-4 h-32 w-full rounded-xl border object-cover" />
                    : <div className="mb-4 h-32 rounded-xl border bg-muted" />}
                  <div className="mb-4">
                    <span className={`rounded-full border px-3 py-1 text-xs font-medium ${STATUS_COLORS[t.status] ?? "border-border"}`}>
                      {STATUS_LABELS[t.status] ?? t.status}
                    </span>
                    <h3 className="mt-4 text-lg font-bold">{t.name}</h3>
                    {t.organizer && <p className="mt-1 text-sm text-muted-foreground">Organizador: {t.organizer.name}</p>}
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between gap-4"><span className="text-muted-foreground">Início</span><strong>{formatarData(t.startDate)}</strong></div>
                    <div className="flex justify-between gap-4"><span className="text-muted-foreground">Término</span><strong>{formatarData(t.endDate)}</strong></div>
                    <div className="flex justify-between gap-4"><span className="text-muted-foreground">Máx. times</span><strong>{t.maxTeams}</strong></div>
                  </div>
                  {t.status === "pending_approval" && (
                    <Link to={`/moderador/torneios/${t.id}`}
                      className="mt-6 block w-full rounded-xl bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground transition hover:opacity-90">
                      Revisar
                    </Link>
                  )}
                </article>
              ))}
            </div>
          )}
      </section>
    </main>
  )
}
