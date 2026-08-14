import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import api from "../../service/api"
import type { Team } from "../../types/team"
import TeamName from "../../components/TeamName"
import IndicatorCard from "../../components/IndicatorCard"
import type { TeamIndicator } from "../../types/indicator"

export default function TimeDetalhe() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [time, setTime] = useState<Team | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState("")
  const [emailMembro, setEmailMembro] = useState("")
  const [adicionando, setAdicionando] = useState(false)
  const [mensagem, setMensagem] = useState("")
  const [indicadores, setIndicadores] = useState<TeamIndicator | null>(null)

  const meuId = localStorage.getItem("cuphub-user-id") ?? ""

  useEffect(() => {
    if (!id) return
    api.get(`/api/teams/${id}`)
      .then((res) => setTime(res.data))
      .catch(() => setErro("Time não encontrado."))
      .finally(() => setCarregando(false))
  }, [id])

  useEffect(() => {
    if (!id) return
    api.get<TeamIndicator>(`/api/indicators/team/${id}`)
      .then((res) => setIndicadores(res.data))
      .catch(() => {})
  }, [id])

  const souCapitao = !!(time && time.captainId === meuId)
  const souMembro = !!(time && time.members.some((m) => m.userId === meuId))

  async function handleConvidarMembro() {
    if (!emailMembro.trim()) return
    setAdicionando(true)
    setMensagem("")
    try {
      await api.post(`/api/teams/${id}/invites?email=${encodeURIComponent(emailMembro.trim())}`)
      setEmailMembro("")
      setMensagem("Convite enviado! O usu\u00e1rio receber\u00e1 um email para aceitar.")
    } catch (e: any) {
      setMensagem(e.response?.data?.message ?? "Erro ao enviar convite.")
    } finally {
      setAdicionando(false)
    }
  }

  async function handleExcluirTime() {
    if (!confirm(`Excluir o time "${time?.name}"? Esta ação não pode ser desfeita.`)) return
    try {
      await api.delete(`/api/teams/${id}`)
      navigate("/times")
    } catch (e: any) {
      setErro(e.response?.data?.message ?? "Erro ao excluir time.")
    }
  }

  if (carregando) {
    return (
      <main>
        <p className="text-muted-foreground">Carregando...</p>
      </main>
    )
  }

  if (erro || !time) {
    return (
      <main>
        <div className="text-center">
          <p className="text-muted-foreground">{erro || "Time n\u00e3o encontrado."}</p>
          <Link to="/times" className="mt-4 inline-block underline text-sm">Voltar para times</Link>
        </div>
      </main>
    )
  }

  return (
    <main>
      <section className="mx-auto max-w-4xl px-6 py-8">
        {time.bannerUrl && (
          <img src={time.bannerUrl} alt={time.name} className="mb-6 h-40 w-full rounded-2xl border object-cover" />
        )}
        <h1 className="text-3xl font-bold"><TeamName teamId={time.id} name={time.name} /></h1>
        <p className="mt-1 text-sm text-muted-foreground">Capitão: {time.captainName}</p>
        {time.description && <p className="mt-4 text-muted-foreground">{time.description}</p>}

        <div className="mt-8">
          <h2 className="mb-4 text-lg font-bold">Membros ({time.members.length})</h2>
          <ul className="space-y-3">
            {time.members.map((m) => (
              <li key={m.userId} className="flex items-center justify-between rounded-xl border bg-card px-4 py-3">
                <span className="font-medium">{m.userName}</span>
                <span className="rounded-full border px-3 py-1 text-xs capitalize">
                  {m.role === "captain" ? "Capit\u00e3o" : "Membro"}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {indicadores && (
          <div className="mt-8">
            <h2 className="mb-4 text-lg font-bold">Indicadores</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <IndicatorCard
                title="Aproveitamento do time"
                value={`${indicadores.aproveitamentoTime.toFixed(1)}%`}
                subtitle={`${indicadores.totalVitorias} vitórias em ${indicadores.totalPartidas} partidas`}
                color="text-purple-600"
              />
              {(souCapitao || souMembro) && (
                <IndicatorCard
                  title="Taxa de aceitação de convites"
                  value={`${indicadores.taxaAceitacaoConvites.toFixed(1)}%`}
                  subtitle={`${indicadores.totalConvitesAceitos} aceitos de ${indicadores.totalConvitesEnviados} enviados`}
                  color="text-green-600"
                />
              )}
            </div>
          </div>
        )}

        {souCapitao && (
          <div className="mt-8 space-y-4">
            <div className="flex gap-3">
              <Link
                to={`/times/${id}/editar`}
                className="flex-1 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground text-center transition hover:opacity-90"
              >
                Editar time
              </Link>
              <button
                type="button"
                onClick={handleExcluirTime}
                className="flex-1 rounded-xl border border-destructive/30 px-5 py-3 text-sm font-semibold text-destructive transition hover:bg-destructive/10"
              >
                Excluir time
              </button>
            </div>

            <div className="rounded-2xl border bg-card p-6">
            <h2 className="mb-4 text-lg font-bold">Convidar membro por email</h2>
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="E-mail do usuário"
                value={emailMembro}
                onChange={(e) => setEmailMembro(e.target.value)}
                className="flex-1 rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                type="button"
                onClick={handleConvidarMembro}
                disabled={adicionando}
                className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
              >
                {adicionando ? "..." : "Convidar"}
              </button>
            </div>
            {mensagem && <p className="mt-3 text-sm text-muted-foreground">{mensagem}</p>}
          </div>
          </div>
        )}
      </section>
    </main>
  )
}
