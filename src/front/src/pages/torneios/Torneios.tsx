import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import { Link } from "react-router-dom"
import api from "../../service/api"
import type { Tournament } from "../../types/tournament"
import { STATUS_LABELS, STATUS_COLORS } from "../../types/tournament"
import { formatarData } from "../../lib/format"

type NovoTorneioForm = {
  name: string; description: string; startDate: string; endDate: string
  maxTeams: number; pointsWin: number; pointsDraw: number; pointsLoss: number; notes: string
}

const formInicial: NovoTorneioForm = {
  name: "", description: "", startDate: "", endDate: "",
  maxTeams: 4, pointsWin: 3, pointsDraw: 1, pointsLoss: 0, notes: "",
}

export default function Torneios() {
  const role = localStorage.getItem("cuphub-user-role") ?? "participant"
  const [torneios, setTorneios] = useState<Tournament[]>([])
  const [carregando, setCarregando] = useState(true)
  const [modalAberto, setModalAberto] = useState(false)
  const [etapa, setEtapa] = useState<1 | 2>(1)
  const [erro, setErro] = useState("")
  const [enviando, setEnviando] = useState(false)
  const [form, setForm] = useState<NovoTorneioForm>(formInicial)

  function carregarTorneios() {
    setCarregando(true)
    api.get("/api/tournaments").then((r) => setTorneios(r.data)).catch(() => setTorneios([])).finally(() => setCarregando(false))
  }

  useEffect(() => { carregarTorneios() }, [])

  function atualizarCampo<K extends keyof NovoTorneioForm>(campo: K, valor: NovoTorneioForm[K]) {
    setForm((s) => ({ ...s, [campo]: valor }))
  }

  function fecharModal() { setModalAberto(false); setEtapa(1); setErro(""); setForm(formInicial) }

  function validarEtapa1() {
    if (form.name.trim().length < 3) { setErro("Nome deve ter pelo menos 3 caracteres."); return false }
    if (!form.startDate) { setErro("Informe a data de início."); return false }
    if (!form.endDate) { setErro("Informe a data de término."); return false }
    if (form.endDate < form.startDate) { setErro("Data de término deve ser após o início."); return false }
    if (form.maxTeams < 4) { setErro("Mínimo de 4 times."); return false }
    setErro(""); return true
  }

  async function submeterTorneio(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setErro(""); setEnviando(true)
    try {
      await api.post("/api/tournaments", {
        name: form.name, description: form.description,
        startDate: new Date(`${form.startDate}T00:00:00`).toISOString(),
        endDate: new Date(`${form.endDate}T00:00:00`).toISOString(),
        maxTeams: form.maxTeams, pointsWin: form.pointsWin,
        pointsDraw: form.pointsDraw, pointsLoss: form.pointsLoss, notes: form.notes,
      })
      fecharModal(); carregarTorneios()
    } catch (e: any) {
      setErro(e.response?.data?.message ?? "Erro ao criar torneio.")
    } finally { setEnviando(false) }
  }

  return (
    <main>
      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Torneios</h2>
            <p className="mt-2 text-muted-foreground">Visualize e participe dos torneios disponíveis.</p>
          </div>
          {(role === "organizer" || role === "admin") && (
            <button type="button" onClick={() => { setForm(formInicial); setEtapa(1); setErro(""); setModalAberto(true) }}
              className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90">
              + Novo Torneio
            </button>
          )}
        </div>

        {carregando ? <p className="text-muted-foreground">Carregando...</p>
          : torneios.length === 0 ? (
            <div className="rounded-2xl border bg-card p-10 text-center text-muted-foreground">Nenhum torneio cadastrado.</div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {torneios.map((t) => (
                <article key={t.id} className="rounded-2xl border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                  {t.bannerUrl
                    ? <img src={t.bannerUrl} alt={t.name} className="mb-4 h-32 w-full rounded-xl border object-cover" />
                    : <div className="mb-4 flex h-32 items-center justify-center rounded-xl border bg-muted text-sm text-muted-foreground">Banner do torneio</div>
                  }
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <h3 className="text-lg font-bold">{t.name}</h3>
                    <span className={`rounded-full border px-3 py-1 text-xs font-medium whitespace-nowrap ${STATUS_COLORS[t.status]}`}>{STATUS_LABELS[t.status]}</span>
                  </div>
                  {t.description && <p className="mb-4 max-h-10 overflow-hidden text-sm text-muted-foreground">{t.description}</p>}
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between gap-4"><span className="text-muted-foreground">Início</span><strong>{formatarData(t.startDate)}</strong></div>
                    <div className="flex justify-between gap-4"><span className="text-muted-foreground">Término</span><strong>{formatarData(t.endDate)}</strong></div>
                    <div className="flex justify-between gap-4"><span className="text-muted-foreground">Times</span><strong>{t.maxTeams}</strong></div>
                  </div>
                  <div className="mt-6">
                    <Link to={`/torneios/${t.id}`}
                      className="block w-full rounded-xl border px-4 py-3 text-center text-sm font-medium transition hover:bg-accent">
                      Ver detalhes
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
      </section>

      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <section className="w-full max-w-3xl rounded-2xl border bg-card shadow-xl">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h2 className="font-bold">Novo Torneio</h2>
              <button type="button" onClick={fecharModal} className="text-2xl leading-none text-muted-foreground hover:text-foreground">×</button>
            </div>
            <div className="px-6 py-5">
              <div className="mb-6 flex items-center gap-3">
                {[1, 2].map((n) => (
                  <div key={n} className="flex items-center gap-2">
                    {n > 1 && <div className="h-px w-8 bg-border" />}
                    <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${etapa === n ? "bg-foreground text-background" : "bg-muted text-muted-foreground"}`}>
                      {etapa > n ? "✓" : n}
                    </span>
                    <span className="text-sm font-medium">{n === 1 ? "Identificação" : "Regras"}</span>
                  </div>
                ))}
              </div>
              {erro && <p className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{erro}</p>}
              {etapa === 1 && (
                <form onSubmit={(e) => { e.preventDefault(); if (validarEtapa1()) setEtapa(2) }} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nome do torneio *</label>
                    <input type="text" placeholder="Ex.: Copa Verão 2026" value={form.name}
                      onChange={(e) => atualizarCampo("name", e.target.value)}
                      className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Descrição</label>
                    <textarea placeholder="Descreva o torneio (opcional)" maxLength={1000} value={form.description}
                      onChange={(e) => atualizarCampo("description", e.target.value)}
                      className="min-h-28 w-full resize-none rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    {(["startDate", "endDate"] as const).map((f) => (
                      <div key={f} className="space-y-2">
                        <label className="text-sm font-medium">{f === "startDate" ? "Data de início *" : "Data de término *"}</label>
                        <input type="date" value={form[f]} onChange={(e) => atualizarCampo(f, e.target.value)}
                          className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nº máximo de times *</label>
                    <input type="number" min={4} value={form.maxTeams}
                      onChange={(e) => atualizarCampo("maxTeams", Number(e.target.value))}
                      className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                  <div className="-mx-6 mt-6 flex justify-end gap-3 border-t px-6 pt-5">
                    <button type="button" onClick={fecharModal} className="rounded-xl border px-5 py-3 text-sm font-semibold transition hover:bg-accent">Cancelar</button>
                    <button type="submit" className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90">Próximo: Regras →</button>
                  </div>
                </form>
              )}
              {etapa === 2 && (
                <form onSubmit={submeterTorneio} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    {(["pointsWin", "pointsDraw", "pointsLoss"] as const).map((f) => (
                      <div key={f} className="space-y-2">
                        <label className="text-sm font-medium">{f === "pointsWin" ? "Pts vitória" : f === "pointsDraw" ? "Pts empate" : "Pts derrota"}</label>
                        <input type="number" min={0} value={form[f]}
                          onChange={(e) => atualizarCampo(f, Number(e.target.value))}
                          className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Regras e observações</label>
                    <textarea placeholder="Regras específicas (opcional)" value={form.notes}
                      onChange={(e) => atualizarCampo("notes", e.target.value)}
                      className="min-h-24 w-full resize-none rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                  <div className="-mx-6 mt-6 flex justify-end gap-3 border-t px-6 pt-5">
                    <button type="button" onClick={() => { setErro(""); setEtapa(1) }} className="rounded-xl border px-5 py-3 text-sm font-semibold transition hover:bg-accent">← Voltar</button>
                    <button type="submit" disabled={enviando}
                      className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50">
                      {enviando ? "Enviando..." : "Submeter para Aprovação"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </section>
        </div>
      )}
    </main>
  )
}
