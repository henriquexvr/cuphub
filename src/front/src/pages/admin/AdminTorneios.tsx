import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import api from "../../service/api"
import { STATUS_LABELS, STATUS_COLORS } from "../../types/tournament"
import type { Tournament } from "../../types/tournament"
import { formatarData } from "../../lib/format"

export default function AdminTorneios() {
  const [torneios, setTorneios] = useState<Tournament[]>([])
  const [filtro, setFiltro] = useState("")
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState("")
  const [processando, setProcessando] = useState<string | null>(null)

  function carregarTorneios() {
    setCarregando(true)
    api.get("/api/tournaments")
      .then((r) => setTorneios(r.data))
      .catch(() => setErro("Erro ao carregar torneios."))
      .finally(() => setCarregando(false))
  }

  useEffect(() => { carregarTorneios() }, [])

  const torneiosFiltrados = torneios.filter(
    (t) =>
      t.name.toLowerCase().includes(filtro.toLowerCase()) ||
      (t.organizer?.name ?? "").toLowerCase().includes(filtro.toLowerCase()) ||
      (STATUS_LABELS[t.status] ?? t.status).toLowerCase().includes(filtro.toLowerCase())
  )

  async function handleExcluir(id: string, nome: string) {
    if (!confirm(`Excluir o torneio "${nome}"? Esta ação não pode ser desfeita.`)) return
    setProcessando(id + "-delete")
    setErro("")
    try {
      await api.delete(`/api/tournaments/${id}`)
      carregarTorneios()
    } catch (e: any) {
      setErro(e.response?.data?.message ?? "Erro ao excluir torneio.")
    } finally {
      setProcessando(null)
    }
  }

  return (
    <main>
      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Torneios</h2>
            <p className="mt-1 text-muted-foreground">
              {torneiosFiltrados.length} de {torneios.length} torneio{torneios.length !== 1 ? "s" : ""}
            </p>
          </div>
          <input
            type="text"
            placeholder="Buscar por nome, organizador ou status..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="w-full rounded-xl border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring md:w-72"
          />
        </div>

        {erro && (
          <p className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {erro}
          </p>
        )}

        {carregando ? (
          <p className="text-muted-foreground">Carregando torneios...</p>
        ) : torneiosFiltrados.length === 0 ? (
          <div className="rounded-2xl border bg-card p-8 text-center text-muted-foreground">
            {filtro ? `Nenhum torneio encontrado para "${filtro}".` : "Nenhum torneio cadastrado."}
          </div>
        ) : (
          <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="px-6 py-3 text-left font-medium text-muted-foreground">Nome</th>
                  <th className="px-6 py-3 text-left font-medium text-muted-foreground">Organizador</th>
                  <th className="px-6 py-3 text-left font-medium text-muted-foreground">Status</th>
                  <th className="px-6 py-3 text-left font-medium text-muted-foreground">Início</th>
                  <th className="px-6 py-3 text-left font-medium text-muted-foreground">Término</th>
                  <th className="px-6 py-3 text-right font-medium text-muted-foreground">Ações</th>
                </tr>
              </thead>
              <tbody>
                {torneiosFiltrados.map((t) => (
                  <tr key={t.id} className="border-b last:border-0 hover:bg-muted/20">
                    <td className="px-6 py-4 font-medium">{t.name}</td>
                    <td className="px-6 py-4 text-muted-foreground">{t.organizer?.name ?? "—"}</td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full border px-3 py-1 text-xs font-medium ${STATUS_COLORS[t.status]}`}>
                        {STATUS_LABELS[t.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{formatarData(t.startDate)}</td>
                    <td className="px-6 py-4 text-muted-foreground">{formatarData(t.endDate)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/torneios/${t.id}`}
                          className="rounded-xl border px-3 py-1.5 text-xs font-medium transition hover:bg-accent"
                        >
                          Ver detalhes
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleExcluir(t.id, t.name)}
                          disabled={processando === t.id + "-delete"}
                          className="rounded-xl border border-destructive/30 px-3 py-1.5 text-xs font-medium text-destructive transition hover:bg-destructive/10 disabled:opacity-50"
                        >
                          {processando === t.id + "-delete" ? "..." : "Excluir"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  )
}
