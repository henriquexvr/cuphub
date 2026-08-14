import { useState, useEffect } from "react"
import type { FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { X } from "lucide-react"
import api from "../../service/api"

interface Props {
  open: boolean
  onClose: () => void
}

export default function CriarTime({ open, onClose }: Props) {
  const navigate = useNavigate()
  const [nome, setNome] = useState("")
  const [descricao, setDescricao] = useState("")
  const [bannerUrl, setBannerUrl] = useState("")
  const [erro, setErro] = useState("")
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    if (!open) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [open, onClose])

  function resetForm() {
    setNome("")
    setDescricao("")
    setBannerUrl("")
    setErro("")
  }

  function handleClose() {
    resetForm()
    onClose()
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErro("")

    if (nome.trim().length < 3) {
      setErro("O nome do time deve ter pelo menos 3 caracteres.")
      return
    }

    setEnviando(true)
    try {
      const res = await api.post("/api/teams", {
        name: nome.trim(),
        description: descricao.trim() || undefined,
        bannerUrl: bannerUrl.trim() || undefined,
      })
      resetForm()
      navigate(`/times/${res.data.id}`)
    } catch (e: any) {
      setErro(e.response?.data?.message ?? "Erro ao criar time. Tente novamente.")
    } finally {
      setEnviando(false)
    }
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl border bg-card p-8 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold">Criar novo time</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Você será o capitão do time.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-1.5 text-muted-foreground transition hover:bg-accent hover:text-foreground"
            aria-label="Fechar"
          >
            <X className="h-4 w-4" />
          </button>
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
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
                onLoad={(e) => { (e.target as HTMLImageElement).style.display = "block" }}
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
            {enviando ? "Criando..." : "Criar time"}
          </button>
        </form>
      </div>
    </div>
  )
}
