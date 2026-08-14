import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import api from "../../service/api"
import type { Tournament } from "../../types/tournament"
import { STATUS_LABELS, STATUS_COLORS } from "../../types/tournament"
import { formatarData } from "../../lib/format"

export default function MeusTorneios() {
  const userId = localStorage.getItem("cuphub-user-id") ?? ""
  const [torneios, setTorneios] = useState<Tournament[]>([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    api
      .get("/api/tournaments")
      .then((r) => {
        const meus = r.data.filter((t: Tournament) => t.organizer?.id === userId)
        setTorneios(meus)
      })
      .catch(() => setTorneios([]))
      .finally(() => setCarregando(false))
  }, [userId])

  return (
    <main>
      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Meus Torneios</h2>
          <p className="mt-2 text-muted-foreground">Torneios que você criou e está organizando.</p>
        </div>

        {carregando ? (
          <p className="text-muted-foreground">Carregando...</p>
        ) : torneios.length === 0 ? (
          <div className="rounded-2xl border bg-card p-10 text-center text-muted-foreground">
            Você ainda não criou nenhum torneio.
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {torneios.map((t) => (
              <article
                key={t.id}
                className="rounded-2xl border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                {t.bannerUrl ? (
                  <img
                    src={t.bannerUrl}
                    alt={t.name}
                    className="mb-4 h-32 w-full rounded-xl border object-cover"
                  />
                ) : (
                  <div className="mb-4 flex h-32 items-center justify-center rounded-xl border bg-muted text-sm text-muted-foreground">
                    Banner do torneio
                  </div>
                )}
                <div className="mb-4 flex items-start justify-between gap-4">
                  <h3 className="text-lg font-bold">{t.name}</h3>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-medium whitespace-nowrap ${STATUS_COLORS[t.status]}`}
                  >
                    {STATUS_LABELS[t.status]}
                  </span>
                </div>
                {t.description && (
                  <p className="mb-4 max-h-10 overflow-hidden text-sm text-muted-foreground">
                    {t.description}
                  </p>
                )}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Início</span>
                    <strong>{formatarData(t.startDate)}</strong>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Término</span>
                    <strong>{formatarData(t.endDate)}</strong>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Times</span>
                    <strong>{t.maxTeams}</strong>
                  </div>
                </div>
                <div className="mt-6">
                  <Link
                    to={`/torneios/${t.id}`}
                    className="block w-full rounded-xl border px-4 py-3 text-center text-sm font-medium transition hover:bg-accent"
                  >
                    Gerenciar torneio
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
