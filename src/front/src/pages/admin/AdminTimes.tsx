import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import api from "../../service/api"
import TeamName from "../../components/TeamName"

type Membro = {
  userId: string
  userName: string
  role: string
}

type Time = {
  id: string
  name: string
  description?: string
  captainId: string
  captainName: string
  members: Membro[]
  createdAt: string
}

export default function AdminTimes() {
  const [times, setTimes] = useState<Time[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState("")
  const [excluindo, setExcluindo] = useState<string | null>(null)

  function carregarTimes() {
    setCarregando(true)
    api
      .get("/api/teams")
      .then((res) => setTimes(res.data))
      .catch(() => setErro("Erro ao carregar times."))
      .finally(() => setCarregando(false))
  }

  useEffect(() => {
    carregarTimes()
  }, [])

  async function handleExcluir(id: string, nome: string) {
    if (!confirm(`Excluir o time "${nome}"? Todos os membros serão removidos.`)) return
    setExcluindo(id)
    try {
      await api.delete(`/api/teams/${id}`)
      carregarTimes()
    } catch (e: any) {
      setErro(e.response?.data?.message ?? "Erro ao excluir time.")
    } finally {
      setExcluindo(null)
    }
  }

  return (
    <main>
      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold tracking-tight">Times</h2>
          <p className="mt-2 text-muted-foreground">
            Visualize e gerencie todos os times cadastrados na plataforma.
          </p>
        </div>

        {erro && (
          <p className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {erro}
          </p>
        )}

        {carregando ? (
          <p className="text-muted-foreground">Carregando times...</p>
        ) : times.length === 0 ? (
          <div className="rounded-2xl border bg-card p-8 text-center text-muted-foreground">
            Nenhum time cadastrado ainda.
          </div>
        ) : (
          <div className="space-y-4">
            {times.map((time) => (
              <div
                key={time.id}
                className="rounded-2xl border bg-card p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-bold truncate"><TeamName teamId={time.id} name={time.name} /></h3>
                      <span className="shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium">
                        {time.members.length} membro{time.members.length !== 1 ? "s" : ""}
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Capitão: {time.captainName}
                    </p>

                    {time.description && (
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                        {time.description}
                      </p>
                    )}

                    {time.members.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {time.members.map((m) => (
                          <span
                            key={m.userId}
                            className="rounded-full border bg-muted/50 px-2.5 py-0.5 text-xs"
                          >
                            {m.userName}
                            {m.role === "captain" && (
                              <span className="ml-1 text-muted-foreground">(cap)</span>
                            )}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="shrink-0 flex flex-col gap-2">
                    <Link
                      to={`/times/${time.id}`}
                      className="rounded-xl border px-3 py-1.5 text-xs font-medium transition hover:bg-accent text-center"
                    >
                      Ver detalhes
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleExcluir(time.id, time.name)}
                      disabled={excluindo === time.id}
                      className="rounded-xl border border-destructive/30 px-3 py-1.5 text-xs font-medium text-destructive transition hover:bg-destructive/10 disabled:opacity-50"
                    >
                      {excluindo === time.id ? "Excluindo..." : "Excluir"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
