import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import api from "../../service/api"
import { formatarData } from "../../lib/format"
import TeamName from "../../components/TeamName"

type Inscricao = {
  id: string
  status: string
  notes?: string
  rejectionReason?: string
  createdAt: string
  tournamentId: string
  tournamentName: string
  tournamentStatus: string
  tournamentStartDate: string
  tournamentEndDate: string
  teamId: string
  teamName: string
}

const STATUS_CONFIG: Record<string, { label: string; classes: string }> = {
  pending:  { label: "Pendente",  classes: "border-border" },
  approved: { label: "Aprovada",  classes: "border-green-500/30 bg-green-500/10 text-green-700" },
  rejected: { label: "Reprovada", classes: "border-destructive/30 bg-destructive/10 text-destructive" },
}

function Contador({ label, valor, destaque }: { label: string; valor: number; destaque?: boolean }) {
  return (
    <div className={`rounded-2xl border p-5 text-center ${destaque ? "bg-card" : "bg-background"}`}>
      <p className="text-3xl font-bold">{valor}</p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </div>
  )
}

export default function MinhasInscricoes() {
  const [inscricoes, setInscricoes] = useState<Inscricao[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState("")

  useEffect(() => {
    api.get("/api/registrations/my")
      .then((r) => setInscricoes(r.data))
      .catch(() => setErro("Erro ao carregar inscrições."))
      .finally(() => setCarregando(false))
  }, [])

  const pendentes  = inscricoes.filter((i) => i.status === "pending")
  const aprovadas  = inscricoes.filter((i) => i.status === "approved")
  const reprovadas = inscricoes.filter((i) => i.status === "rejected")

  const sections = [
    { titulo: "Pendentes",  subtitulo: "Aguardando aprovação do organizador", items: pendentes },
    { titulo: "Aprovadas",  subtitulo: "Prontas para competir",                items: aprovadas },
    { titulo: "Reprovadas", subtitulo: "Não aprovadas",                        items: reprovadas },
  ].filter((s) => s.items.length > 0)

  return (
    <main>
      <section className="mx-auto max-w-4xl px-6 py-8 space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Minhas inscrições</h2>
          <p className="mt-2 text-muted-foreground">
            Acompanhe o status das inscrições dos seus times nos torneios.
          </p>
        </div>

        {erro && (
          <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {erro}
          </p>
        )}

        {carregando ? (
          <div className="space-y-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-24 rounded-2xl border bg-card animate-pulse" />
            ))}
          </div>
        ) : inscricoes.length === 0 ? (
          <div className="rounded-2xl border border-dashed bg-card p-12 text-center">
            <p className="text-lg font-semibold">Nenhuma inscrição encontrada</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Você ainda não inscreveu nenhum time. Explore os torneios disponíveis!
            </p>
            <Link to="/torneios"
              className="mt-6 inline-block rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90">
              Ver torneios
            </Link>
          </div>
        ) : (
          <>
            {/* Resumo */}
            <div className="grid grid-cols-3 gap-4">
              <Contador label="Pendentes"  valor={pendentes.length} />
              <Contador label="Aprovadas"  valor={aprovadas.length} destaque />
              <Contador label="Reprovadas" valor={reprovadas.length} />
            </div>

            {/* Seções por status */}
            {sections.map(({ titulo, subtitulo, items }) => (
              <div key={titulo}>
                <div className="mb-4 flex items-center gap-3">
                  <h3 className="text-lg font-bold">{titulo}</h3>
                  <span className="text-sm text-muted-foreground">{subtitulo}</span>
                </div>
                <div className="space-y-3">
                  {items.map((i) => {
                    const cfg = STATUS_CONFIG[i.status] ?? STATUS_CONFIG.pending
                    return (
                      <div key={i.id}
                        className="flex flex-col gap-3 rounded-2xl border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${cfg.classes}`}>
                              {cfg.label}
                            </span>
                            <span className="text-xs text-muted-foreground">Time: <TeamName teamId={i.teamId} name={i.teamName} /></span>
                          </div>
                          <h4 className="font-semibold">
                            <Link to={`/torneios/${i.tournamentId}`} className="hover:underline">
                              {i.tournamentName}
                            </Link>
                          </h4>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {formatarData(i.tournamentStartDate)} → {formatarData(i.tournamentEndDate)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Status do torneio: <span className="font-medium capitalize">{i.tournamentStatus}</span>
                          </p>
                          {i.rejectionReason && (
                            <p className="mt-2 text-xs text-destructive">
                              Motivo da reprovação: {i.rejectionReason}
                            </p>
                          )}
                        </div>
                        <Link to={`/torneios/${i.tournamentId}`}
                          className="shrink-0 rounded-xl border px-4 py-2 text-sm font-medium transition hover:bg-accent">
                          Ver torneio →
                        </Link>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </>
        )}
      </section>
    </main>
  )
}
