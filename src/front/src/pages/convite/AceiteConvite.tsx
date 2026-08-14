import { useEffect, useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import api from "../../service/api"
import TeamName from "../../components/TeamName"

type InviteInfo = {
  id: string; teamId: string; teamName: string
  invitedEmail: string; status: string; expiresAt: string
}

export default function AceiteConvite() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token")
  const navigate = useNavigate()
  const [convite, setConvite] = useState<InviteInfo | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState("")
  const [processando, setProcessando] = useState(false)
  const [sucesso, setSucesso] = useState("")

  const estaLogado = !!localStorage.getItem("cuphub-token")

  useEffect(() => {
    if (!token) { setErro("Token de convite inv\u00e1lido."); setCarregando(false); return }
    api.get(`/api/teams/invites/${token}`)
      .then((res) => setConvite(res.data))
      .catch(() => setErro("Convite n\u00e3o encontrado ou expirado."))
      .finally(() => setCarregando(false))
  }, [token])

  async function handleAceitar() {
    if (!estaLogado) { navigate(`/login`); return }
    setProcessando(true)
    try {
      await api.post(`/api/teams/invites/${token}/accept`)
      setSucesso(`Voc\u00ea agora faz parte do time ${convite?.teamName}!`)
      setTimeout(() => navigate("/dashboard"), 1500)
    } catch (e: any) {
      setErro(e.response?.data?.message ?? "Erro ao aceitar convite.")
    } finally { setProcessando(false) }
  }

  async function handleRecusar() {
    if (!estaLogado) { navigate(`/login`); return }
    setProcessando(true)
    try {
      await api.post(`/api/teams/invites/${token}/reject`)
      setSucesso("Convite recusado.")
      setTimeout(() => navigate("/dashboard"), 1500)
    } catch (e: any) {
      setErro(e.response?.data?.message ?? "Erro ao recusar convite.")
    } finally { setProcessando(false) }
  }

  if (carregando) {
    return <main className="flex min-h-screen items-center justify-center"><p className="text-muted-foreground">Carregando convite...</p></main>
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <section className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-sm text-center">
        <h1 className="text-2xl font-bold mb-2">CupHub</h1>

        {sucesso && (
          <>
            <p className="mt-6 text-lg font-medium">{sucesso}</p>
            <p className="mt-2 text-sm text-muted-foreground">Redirecionando...</p>
          </>
        )}

        {!sucesso && erro && (
          <>
            <p className="mt-4 text-muted-foreground">{erro}</p>
            <Link to="/login" className="mt-6 inline-block underline text-sm">Ir para o login</Link>
          </>
        )}

        {!sucesso && !erro && convite && (
          <>
            <p className="mt-4 text-muted-foreground">Voc\u00ea foi convidado para o time:</p>
            <p className="mt-2 text-2xl font-bold"><TeamName teamId={convite.teamId} name={convite.teamName} /></p>
            <p className="mt-2 text-sm text-muted-foreground">Convite enviado para: {convite.invitedEmail}</p>

            {convite.status !== "pending" ? (
              <p className="mt-6 text-muted-foreground">
                Este convite j\u00e1 foi {convite.status === "accepted" ? "aceito" : "recusado"}.
              </p>
            ) : !estaLogado ? (
              <div className="mt-6">
                <p className="text-sm text-muted-foreground mb-4">Fa\u00e7a login para aceitar ou recusar este convite.</p>
                <Link to="/login" className="inline-block rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90">
                  Fazer login
                </Link>
              </div>
            ) : (
              <div className="mt-6 flex gap-3 justify-center">
                <button type="button" onClick={handleRecusar} disabled={processando}
                  className="rounded-xl border px-6 py-3 text-sm font-semibold transition hover:bg-accent disabled:opacity-50">
                  Recusar
                </button>
                <button type="button" onClick={handleAceitar} disabled={processando}
                  className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50">
                  {processando ? "..." : "Aceitar convite"}
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  )
}
