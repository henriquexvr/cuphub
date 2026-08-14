import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import api from "../../service/api"

type TeamData = {
  id: string
  name: string
  description?: string
  bannerUrl?: string
}

export default function EditarTime() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [nome, setNome] = useState("")
  const [descricao, setDescricao] = useState("")
  const [bannerUrl, setBannerUrl] = useState("")
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState("")
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    if (!id) return
    api.get<TeamData>(`/api/teams/${id}`)
      .then((res) => {
        setNome(res.data.name)
        setDescricao(res.data.description ?? "")
        setBannerUrl(res.data.bannerUrl ?? "")
      })
      .catch(() => setErro("Erro ao carregar dados do time."))
      .finally(() => setCarregando(false))
  }, [id])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErro("")

    if (nome.trim().length < 3) {
      setErro("O nome do time deve ter pelo menos 3 caracteres.")
      return
    }

    setEnviando(true)
    try {
      await api.put(`/api/teams/${id}`, {
        name: nome.trim(),
        description: descricao.trim() || undefined,
        bannerUrl: bannerUrl.trim() || undefined,
      })
      navigate(`/times/${id}`)
    } catch (e: any) {
      setErro(e.response?.data?.message ?? "Erro ao atualizar time. Tente novamente.")
    } finally {
      setEnviando(false)
    }
  }

  if (carregando) {
    return (
      <main>
        <p className="text-muted-foreground">Carregando...</p>
      </main>
    )
  }

  return (
    <main>
      <section className="w-full max-w-lg rounded-2xl border bg-card p-8 shadow-sm">
        <div className="mb-6">
          <Link
            to={`/times/${id}`}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Voltar para o time
          </Link>
          <h1 className="mt-4 text-2xl font-bold">Editar time</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="nome" className="text-sm font-medium">
              Nome do time *
            </label>
            <input
              id="nome"
              type="text"
              placeholder="Ex.: Os Invencíveis"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="descricao" className="text-sm font-medium">
              Descrição
            </label>
            <textarea
              id="descricao"
              placeholder="Descreva seu time (opcional)"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="min-h-24 w-full resize-none rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="banner" className="text-sm font-medium">
              URL da imagem de banner
            </label>
            <input
              id="banner"
              type="text"
              placeholder="https://exemplo.com/banner.jpg"
              value={bannerUrl}
              onChange={(e) => setBannerUrl(e.target.value)}
              className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {bannerUrl && (
            <div className="overflow-hidden rounded-xl border">
              <img
                src={bannerUrl}
                alt="Preview do banner"
                className="h-32 w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none"
                }}
                onLoad={(e) => {
                  (e.target as HTMLImageElement).style.display = "block"
                }}
              />
            </div>
          )}

          {erro && (
            <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {erro}
            </p>
          )}

          <button
            type="submit"
            disabled={enviando}
            className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
          >
            {enviando ? "Salvando..." : "Salvar alterações"}
          </button>
        </form>
      </section>
    </main>
  )
}
