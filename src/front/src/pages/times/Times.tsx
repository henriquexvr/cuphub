import { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import api from "../../service/api"
import type { Team } from "../../types/team"
import CriarTime from "./CriarTime"
import TeamName from "../../components/TeamName"
import { useAuth } from "../../hooks/useAuth"
import { Crown, Users } from "lucide-react"

export default function Times() {
  const { userId } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const criarAbertoParam = searchParams.get("criar") === "true"
  const [times, setTimes] = useState<Team[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState("")
  const [criarAberto, setCriarAberto] = useState(criarAbertoParam)

  useEffect(() => {
    if (criarAbertoParam) setCriarAberto(true)
  }, [criarAbertoParam])

  useEffect(() => {
    api.get("/api/teams")
      .then((res) => setTimes(res.data))
      .catch(() => setErro("Erro ao carregar times."))
      .finally(() => setCarregando(false))
  }, [])

  return (
    <main>
      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Times</h2>
            <p className="mt-2 text-muted-foreground">
              Veja todos os times ou crie o seu próprio.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSearchParams({ criar: "true" })}
            className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            + Criar Time
          </button>
        </div>

        {carregando && (
          <p className="text-muted-foreground">Carregando times...</p>
        )}

        {erro && (
          <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {erro}
          </p>
        )}

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {times.map((time) => {
            const ehCapitao = userId && time.captainId === userId
            const ehMembro = userId && time.members.some((m) => m.userId === userId)
            const estaParticipando = ehCapitao || ehMembro

            let borderClass = "border"
            if (ehCapitao) borderClass = "border-yellow-500/40"
            else if (ehMembro) borderClass = "border-blue-500/30"

            return (
              <div
                key={time.id}
                className={`rounded-2xl bg-card p-6 shadow-sm transition hover:shadow-md ${borderClass}`}
              >
                {estaParticipando && (
                  <div className="mb-3 flex gap-2">
                    {ehCapitao && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-2.5 py-0.5 text-xs font-semibold text-yellow-600">
                        <Crown className="h-3 w-3" /> Capitão
                      </span>
                    )}
                    {ehMembro && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-600">
                        <Users className="h-3 w-3" /> Meu time
                      </span>
                    )}
                  </div>
                )}
                {time.bannerUrl ? (
                  <img
                    src={time.bannerUrl}
                    alt={time.name}
                    className="mb-4 h-28 w-full rounded-xl border object-cover"
                  />
                ) : (
                  <div className="mb-4 flex h-28 items-center justify-center rounded-xl border bg-muted text-sm text-muted-foreground">
                    Sem banner
                  </div>
                )}
                <h3 className="text-lg font-bold"><TeamName teamId={time.id} name={time.name} /></h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Capitão: {time.captainName}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {time.members.length} membro{time.members.length !== 1 ? "s" : ""}
                </p>
                {time.description && (
                  <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                    {time.description}
                  </p>
                )}
                <Link
                  to={`/times/${time.id}`}
                  className="mt-4 inline-block rounded-xl border px-4 py-2 text-sm font-medium transition hover:bg-accent"
                >
                  Ver detalhes
                </Link>
              </div>
            )
          })}
        </div>

        {!carregando && !erro && times.length === 0 && (
          <p className="text-center text-muted-foreground py-16">
            Nenhum time cadastrado ainda.{" "}
            <button
              type="button"
              onClick={() => setSearchParams({ criar: "true" })}
              className="underline font-medium text-foreground"
            >
              Crie o primeiro!
            </button>
          </p>
        )}
      </section>

      <CriarTime open={criarAberto} onClose={() => { setCriarAberto(false); setSearchParams({}) }} />
    </main>
  )
}
