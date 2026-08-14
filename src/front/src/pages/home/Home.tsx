import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import api from "../../service/api"
import type { Tournament } from "../../types/tournament"
import { STATUS_LABELS, STATUS_COLORS } from "../../types/tournament"
import Header from "../../components/layout/Header"
import { formatarData } from "../../lib/format"

export default function Home() {
  const [torneios, setTorneios] = useState<Tournament[]>([])
  const [carregando, setCarregando] = useState(true)
  const token = localStorage.getItem("cuphub-token")

  useEffect(() => {
    api.get("/api/tournaments")
      .then((r) => setTorneios(r.data))
      .catch(() => {})
      .finally(() => setCarregando(false))
  }, [])

  const emAndamento = torneios.filter((t) => t.status === "in_progress")
  const inscricoesAbertas = torneios.filter((t) => t.status === "registration_open")
  const encerrados = torneios.filter((t) => t.status === "finished")

  const stats = [
    { label: "Total de torneios", value: torneios.length },
    { label: "Em andamento", value: emAndamento.length },
    { label: "Inscrições abertas", value: inscricoesAbertas.length },
    { label: "Encerrados", value: encerrados.length },
  ]

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="border-b bg-card">
        <div className="mx-auto max-w-6xl px-6 py-16 text-center">
          <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Competições organizadas,<br />resultados memoráveis
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-lg text-muted-foreground">
            Crie, gerencie e acompanhe torneios de qualquer modalidade em um só lugar.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to="/torneios"
              className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90">
              Ver torneios
            </Link>
            <Link to={token ? "/dashboard" : "/login"}
              className="rounded-xl border px-6 py-3 text-sm font-semibold transition hover:bg-accent">
              {token ? "Meu dashboard" : "Entrar"}
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl border bg-background p-4">
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-10 space-y-12">
        {carregando && (
          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-48 rounded-2xl border bg-card animate-pulse" />
            ))}
          </div>
        )}

        {[
          { label: "Em andamento", items: emAndamento },
          { label: "Inscrições abertas", items: inscricoesAbertas },
          { label: "Encerrados", items: encerrados },
        ]
          .filter((s) => s.items.length > 0)
          .map(({ label, items }) => (
            <section key={label}>
              <h3 className="mb-5 text-xl font-bold">{label}</h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {items.map((t) => (
                  <Link key={t.id} to={token ? `/torneios/${t.id}` : "/login"}
                    className="rounded-2xl border bg-card p-5 transition hover:-translate-y-1 hover:shadow-md">
                    {t.bannerUrl && (
                      <img src={t.bannerUrl} alt={t.name} className="mb-3 h-28 w-full rounded-xl border object-cover" />
                    )}
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold">{t.name}</h4>
                      <span className={`rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap ${STATUS_COLORS[t.status]}`}>
                        {STATUS_LABELS[t.status]}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {formatarData(t.startDate)} → {formatarData(t.endDate)}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">{t.maxTeams} times</p>
                  </Link>
                ))}
              </div>
            </section>
          ))}

        {!carregando && torneios.length === 0 && (
          <div className="py-20 text-center text-muted-foreground">
            <p className="text-lg font-medium">Nenhum torneio disponível ainda.</p>
            <p className="mt-2 text-sm">
              {token
                ? <Link to="/torneios" className="underline">Seja o primeiro a criar um!</Link>
                : <Link to="/cadastro" className="underline">Cadastre-se e crie o primeiro!</Link>
              }
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
