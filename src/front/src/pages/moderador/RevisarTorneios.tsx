import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import api from "../../service/api"
import { formatarData } from "../../lib/format"

type Torneio = {
  id: string; name: string; description?: string; bannerUrl?: string
  startDate: string; endDate: string; maxTeams: number
  pointsWin: number; pointsDraw: number; pointsLoss: number; notes?: string
  organizer?: { id: string; name: string; email: string }
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-background p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-2 font-semibold">{value}</p>
    </div>
  )
}

export default function RevisarTorneio() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [torneio, setTorneio] = useState<Torneio | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [processando, setProcessando] = useState(false)
  const [erro, setErro] = useState("")
  const [modalRejeitar, setModalRejeitar] = useState(false)
  const [motivoRejeicao, setMotivoRejeicao] = useState("")

  useEffect(() => {
    if (!id) return
    api.get(`/api/tournaments/${id}`)
      .then((r) => setTorneio(r.data))
      .catch(() => setErro("Torneio não encontrado."))
      .finally(() => setCarregando(false))
  }, [id])

  async function handleAprovar() {
    if (!id) return; setProcessando(true)
    try { await api.patch(`/api/tournaments/${id}/status?status=approved`); navigate("/moderador/torneios") }
    catch (e: any) { setErro(e.response?.data?.message ?? "Erro ao aprovar.") }
    finally { setProcessando(false) }
  }

  async function handleReprovar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); if (!id) return; setProcessando(true)
    try {
      const p = new URLSearchParams({ status: "rejected" })
      if (motivoRejeicao.trim()) p.append("rejectionReason", motivoRejeicao.trim())
      await api.patch(`/api/tournaments/${id}/status?${p.toString()}`)
      navigate("/moderador/torneios")
    } catch (e: any) { setErro(e.response?.data?.message ?? "Erro ao reprovar.") }
    finally { setProcessando(false) }
  }

  if (carregando) return <main className="flex min-h-screen items-center justify-center"><p className="text-muted-foreground">Carregando...</p></main>
  if (!torneio) return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <section className="max-w-md rounded-2xl border bg-card p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold">Torneio não encontrado</h1>
        <Link to="/moderador/torneios" className="mt-6 inline-block rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground">Voltar</Link>
      </section>
    </main>
  )

  return (
    <main>
      <section className="mx-auto max-w-6xl px-6 py-8">
        {torneio.bannerUrl ? <img src={torneio.bannerUrl} alt={torneio.name} className="mb-6 h-56 w-full rounded-2xl border object-cover" />
          : <div className="mb-6 h-56 rounded-2xl border bg-muted" />}
        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <div className="mb-8">
            <h2 className="text-3xl font-bold">{torneio.name}</h2>
            {torneio.description && <p className="mt-3 text-muted-foreground">{torneio.description}</p>}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {torneio.organizer && <Info label="Organizador" value={torneio.organizer.name} />}
            <Info label="Data de início" value={formatarData(torneio.startDate)} />
            <Info label="Data de término" value={formatarData(torneio.endDate)} />
            <Info label="Máx. de times" value={String(torneio.maxTeams)} />
            <Info label="Pts vitória" value={String(torneio.pointsWin)} />
            <Info label="Pts empate" value={String(torneio.pointsDraw)} />
            <Info label="Pts derrota" value={String(torneio.pointsLoss)} />
          </div>
          {torneio.notes && (
            <div className="mt-6 rounded-xl border bg-background p-4">
              <p className="text-sm font-medium">Regras adicionais</p>
              <p className="mt-2 text-sm text-muted-foreground whitespace-pre-line">{torneio.notes}</p>
            </div>
          )}
          {erro && <p className="mt-4 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{erro}</p>}
          <div className="mt-8 flex flex-col gap-3 border-t pt-6 sm:flex-row sm:justify-end">
            <button type="button" onClick={() => setModalRejeitar(true)} disabled={processando}
              className="rounded-xl border px-5 py-3 text-sm font-semibold transition hover:bg-accent disabled:opacity-50">Reprovar</button>
            <button type="button" onClick={handleAprovar} disabled={processando}
              className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50">
              {processando ? "Processando..." : "Aprovar Torneio"}
            </button>
          </div>
        </div>
      </section>
      {modalRejeitar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <section className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-xl">
            <h2 className="mb-4 text-lg font-bold">Reprovar torneio</h2>
            <form onSubmit={handleReprovar} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Motivo (opcional)</label>
                <textarea value={motivoRejeicao} onChange={(e) => setMotivoRejeicao(e.target.value)}
                  placeholder="Descreva o motivo para o organizador..."
                  className="min-h-24 w-full resize-none rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModalRejeitar(false)}
                  className="flex-1 rounded-xl border px-4 py-3 text-sm font-semibold transition hover:bg-accent">Cancelar</button>
                <button type="submit" disabled={processando}
                  className="flex-1 rounded-xl bg-destructive px-4 py-3 text-sm font-semibold text-destructive-foreground transition hover:opacity-90 disabled:opacity-50">
                  {processando ? "..." : "Confirmar reprovação"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  )
}
