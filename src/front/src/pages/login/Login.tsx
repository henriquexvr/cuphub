import { useState } from "react"
import type { FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { isAxiosError } from "axios"
import api from "../../service/api"

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [erro, setErro] = useState("")

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErro("")
    if (!email || !senha) { setErro("Informe seu e-mail e senha."); return }
    try {
      const { data } = await api.post("/api/auth/login", { email, password: senha })
      localStorage.setItem("cuphub-token", data.token)
      localStorage.setItem("cuphub-auth", "true")
      localStorage.setItem("cuphub-user-id", data.userId)
      localStorage.setItem("cuphub-user-name", data.name)
      localStorage.setItem("cuphub-user-email", email)
      localStorage.setItem("cuphub-user-role", data.role)
      navigate("/dashboard")
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        setErro(error.response.data?.message ?? "Credenciais inválidas.")
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
          <p className="mt-2 text-sm text-muted-foreground">Entre na sua conta para gerenciar torneios.</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">E-mail</label>
            <input id="email" type="email" placeholder="seuemail@exemplo.com" value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-ring" />
          </div>
          <div className="space-y-2">
            <label htmlFor="senha" className="text-sm font-medium">Senha</label>
            <input id="senha" type="password" placeholder="Digite sua senha" value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-ring" />
          </div>
          {erro && <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{erro}</p>}
          <button type="submit"
            className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90">
            Entrar
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Ainda não tem conta?{" "}
          <Link to="/cadastro" className="font-medium text-foreground underline">Criar cadastro</Link>
        </p>
      </section>
    </main>
  )
}
