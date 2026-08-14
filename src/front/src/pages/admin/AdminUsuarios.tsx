import { useEffect, useState } from "react"
import api from "../../service/api"

type Usuario = {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
}

const ROLE_LABELS: Record<string, string> = {
  admin: "Admin",
  organizer: "Organizador",
  participant: "Participante",
}

export default function AdminUsuarios() {
  const meuId = localStorage.getItem("cuphub-user-id") ?? ""
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [filtro, setFiltro] = useState("")
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState("")
  const [processando, setProcessando] = useState<string | null>(null)

  function carregarUsuarios() {
    setCarregando(true)
    api.get("/api/users")
      .then((r) => setUsuarios(r.data))
      .catch(() => setErro("Erro ao carregar usuários."))
      .finally(() => setCarregando(false))
  }

  useEffect(() => { carregarUsuarios() }, [])

  const usuariosFiltrados = usuarios.filter(
    (u) =>
      u.name.toLowerCase().includes(filtro.toLowerCase()) ||
      u.email.toLowerCase().includes(filtro.toLowerCase())
  )

  async function handleAlterarRole(id: string, novoRole: string) {
    setProcessando(id + "-role")
    setErro("")
    try {
      await api.patch(`/api/users/${id}/role?role=${novoRole}`)
      carregarUsuarios()
    } catch (e: any) {
      setErro(e.response?.data?.message ?? "Erro ao alterar papel.")
    } finally {
      setProcessando(null) }
  }

  async function handleExcluir(id: string, nome: string) {
    if (!confirm(`Excluir o usuário "${nome}"? Esta ação não pode ser desfeita.`)) return
    setProcessando(id + "-delete")
    setErro("")
    try {
      await api.delete(`/api/users/${id}`)
      carregarUsuarios()
    } catch (e: any) {
      setErro(e.response?.data?.message ?? "Erro ao excluir usuário.")
    } finally {
      setProcessando(null)
    }
  }

  return (
    <main>
      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Usuários</h2>
            <p className="mt-1 text-muted-foreground">
              {usuariosFiltrados.length} de {usuarios.length} usuário{usuarios.length !== 1 ? "s" : ""}
            </p>
          </div>
          {/* Busca */}
          <input
            type="text"
            placeholder="Buscar por nome ou email..."
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
          <p className="text-muted-foreground">Carregando usuários...</p>
        ) : usuariosFiltrados.length === 0 ? (
          <div className="rounded-2xl border bg-card p-8 text-center text-muted-foreground">
            {filtro ? `Nenhum usuário encontrado para "${filtro}".` : "Nenhum usuário cadastrado."}
          </div>
        ) : (
          <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="px-6 py-3 text-left font-medium text-muted-foreground">Nome</th>
                  <th className="px-6 py-3 text-left font-medium text-muted-foreground">Email</th>
                  <th className="px-6 py-3 text-left font-medium text-muted-foreground">Papel</th>
                  <th className="px-6 py-3 text-right font-medium text-muted-foreground">Ações</th>
                </tr>
              </thead>
              <tbody>
                {usuariosFiltrados.map((u) => (
                  <tr key={u.id} className="border-b last:border-0 hover:bg-muted/20">
                    <td className="px-6 py-4 font-medium">
                      {u.name}
                      {u.id === meuId && (
                        <span className="ml-2 text-xs text-muted-foreground">(você)</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full border px-3 py-1 text-xs font-medium ${
                        u.role === "admin"
                          ? "border-primary/30 bg-primary/10 text-primary"
                          : u.role === "organizer"
                          ? "border-blue-500/30 bg-blue-500/10 text-blue-700"
                          : "border-border"
                      }`}>
                        {ROLE_LABELS[u.role] ?? u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {u.id !== meuId && (
                        <div className="flex items-center justify-end gap-2 flex-wrap">
                          {/* Selector de papel */}
                          <select
                            value={u.role}
                            onChange={(e) => handleAlterarRole(u.id, e.target.value)}
                            disabled={processando === u.id + "-role"}
                            className="rounded-xl border bg-background px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                          >
                            <option value="participant">Participante</option>
                            <option value="organizer">Organizador</option>
                            <option value="admin">Admin</option>
                          </select>

                          {/* Excluir */}
                          <button
                            type="button"
                            onClick={() => handleExcluir(u.id, u.name)}
                            disabled={processando === u.id + "-delete"}
                            className="rounded-xl border border-destructive/30 px-3 py-1.5 text-xs font-medium text-destructive transition hover:bg-destructive/10 disabled:opacity-50"
                          >
                            {processando === u.id + "-delete" ? "..." : "Excluir"}
                          </button>
                        </div>
                      )}
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
