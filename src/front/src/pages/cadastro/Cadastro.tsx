import { useState } from "react"
import type { FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { isAxiosError } from "axios"
import api from "../../service/api"

type Role = "participant" | "organizer"

export default function Cadastro() {
  const navigate = useNavigate()
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [confirmarSenha, setConfirmarSenha] = useState("")
  const [role, setRole] = useState<Role>("participant")
  const [erro, setErro] = useState("")

  async function handleCadastro(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErro("")
    if (!nome || !email || !senha || !confirmarSenha) { setErro("Preencha todos os campos."); return }
    if (senha.length < 8) { setErro("A senha deve ter pelo menos 8 caracteres."); return }
    if (senha !== confirmarSenha) { setErro("As senhas não conferem."); return }
    try {
      const { data } = await api.post("/api/auth/register", {
        name: nome, email, password: senha, confirmPassword: confirmarSenha, role,
      })
      localStorage.setItem("cuphub-token", data.token)
      localStorage.setItem("cuphub-auth", "true")
      localStorage.setItem("cuphub-user-id", data.userId)
      localStorage.setItem("cuphub-user-name", data.name)
      localStorage.setItem("cuphub-user-email", email)
      localStorage.setItem("cuphub-user-role", data.role)
      navigate("/dashboard")
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        setErro(error.response.data?.message ?? "Erro ao criar conta.")
      } else {
        setErro("Erro ao conectar com o servidor.")
      }
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <section className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">CupHub</h1>
          <p className="mt-2 text-sm text-muted-foreground">Cadastre-se para participar e organizar torneios.</p>
        </div>
        <form onSubmit={handleCadastro} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium">Tipo de conta</label>
            <div className="grid grid-cols-2 gap-3">
              {(["participant", "organizer"] as Role[]).map((r) => (
                <button key={r} type="button" onClick={() => setRole(r)}
                  className={`flex flex-col items-start gap-1 rounded-xl border p-3 text-left text-sm transition-all ${
                    role === r ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:border-muted-foreground/40"
                  }`}>
                  <span className="font-medium">{r === "participant" ? "Participante" : "Organizador"}</span>
                  <span className="text-xs text-muted-foreground">
                    {r === "participant" ? "Entra em times e participa de torneios" : "Cria e gerencia torneios"}
                  </span>
                </button>
              ))}
            </div>
          </div>
          {[
            { id: "nome", label: "Nome", type: "text", value: nome, set: setNome, placeholder: "Seu nome" },
            { id: "email", label: "E-mail", type: "email", value: email, set: setEmail, placeholder: "seuemail@exemplo.com" },
            { id: "senha", label: "Senha", type: "password", value: senha, set: setSenha, placeholder: "Mínimo de 8 caracteres" },
            { id: "confirmarSenha", label: "Confirmar senha", type: "password", value: confirmarSenha, set: setConfirmarSenha, placeholder: "Repita sua senha" },
          ].map((f) => (
            <div key={f.id} className="space-y-2">
              <label htmlFor={f.id} className="text-sm font-medium">{f.label}</label>
              <input id={f.id} type={f.type} placeholder={f.placeholder} value={f.value}
                onChange={(e) => f.set(e.target.value)}
                className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-ring" />
            </div>
          ))}
          {erro && <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{erro}</p>}
          <button type="submit"
            className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90">
            Criar conta
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Já possui conta?{" "}
          <Link to="/login" className="font-medium text-foreground underline">Entrar</Link>
        </p>
      </section>
    </main>
  )
}
