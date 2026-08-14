import { Link } from "react-router-dom"

const itens = [
  {
    titulo: "Gestão de Usuários",
    descricao: "Visualize todos os usuários, altere papéis (participante/organizador/admin) e remova contas.",
    href: "/admin/usuarios",
    label: "Gerenciar usuários",
  },
  {
    titulo: "Gestão de Times",
    descricao: "Visualize todos os times da plataforma, veja membros e remova times quando necessário.",
    href: "/admin/times",
    label: "Gerenciar times",
  },
  {
    titulo: "Aprovação de Torneios",
    descricao: "Revise os torneios submetidos pelos organizadores e aprove ou reprove antes da publicação.",
    href: "/moderador/torneios",
    label: "Revisar torneios",
  },
  {
    titulo: "Gestão de Torneios",
    descricao: "Visualize todos os torneios da plataforma, busque por nome ou organizador e exclua quando necessário.",
    href: "/admin/torneios",
    label: "Gerenciar torneios",
  },
]

export default function Admin() {
  const nome = localStorage.getItem("cuphub-user-name") ?? "Admin"

  return (
    <main>
      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Olá, {nome}</h2>
          <p className="mt-2 text-muted-foreground">
            Selecione uma área para gerenciar.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {itens.map((item) => (
            <Link key={item.href} to={item.href}
              className="flex flex-col rounded-2xl border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <h3 className="text-lg font-bold">{item.titulo}</h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{item.descricao}</p>
              <div className="mt-5">
                <span className="inline-block rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">
                  {item.label} →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
