import { useRef, useState, useEffect } from "react"
import { Link, NavLink } from "react-router-dom"
import { ChevronDown } from "lucide-react"
import { useAuth, type UserRole } from "../../hooks/useAuth"

const NAV_LINKS: Record<UserRole, { label: string; to: string }[]> = {
  participant: [
    { label: "Torneios", to: "/torneios" },
    { label: "Times", to: "/times" },
    { label: "Inscrições", to: "/dashboard/inscricoes" },
  ],
  organizer: [
    { label: "Torneios", to: "/torneios" },
    { label: "Meus Torneios", to: "/meus-torneios" },
    { label: "Times", to: "/times" },
  ],
  admin: [
    { label: "Torneios", to: "/torneios" },
    { label: "Moderador", to: "/moderador/torneios" },
    { label: "Admin", to: "/admin" },
  ],
}

const BADGE: Record<UserRole, { label: string; className: string }> = {
  participant: {
    label: "Participante",
    className: "text-indigo-400 bg-indigo-500/20 border border-indigo-500/40",
  },
  organizer: {
    label: "Organizador",
    className: "text-emerald-400 bg-emerald-500/20 border border-emerald-500/40",
  },
  admin: {
    label: "Admin",
    className: "text-red-400 bg-red-500/20 border border-red-500/40",
  },
}

export default function Header() {
  const { name, role, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const token = localStorage.getItem("cuphub-token")

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  if (!token) {
    return (
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="text-xl font-bold tracking-tight hover:opacity-80 transition-opacity">
            CupHub
          </Link>

          <div className="flex items-center gap-3">
            <Link to="/login"
              className="rounded-xl border px-4 py-2 text-sm font-medium transition hover:bg-accent">
              Entrar
            </Link>
            <Link to="/cadastro"
              className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90">
              Cadastrar
            </Link>
          </div>
        </div>
      </header>
    )
  }

  const badge = BADGE[role]
  const links = NAV_LINKS[role]

  return (
    <header className="border-b bg-card">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-xl font-bold tracking-tight hover:opacity-80 transition-opacity">
          CupHub
        </Link>

        <nav className="flex items-center gap-6">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm transition-colors hover:text-foreground ${
                  isActive
                    ? "font-bold text-foreground"
                    : "font-medium text-muted-foreground"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide ${badge.className}`}>
            {badge.label}
          </span>

          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-haspopup="true"
              className="flex items-center gap-1.5 rounded-xl border px-4 py-2 text-sm font-medium transition hover:bg-accent"
            >
              {name}
              <ChevronDown className="h-3.5 w-3.5 opacity-60" />
            </button>

            {open && (
              <div role="menu" className="absolute right-0 top-full z-50 mt-1.5 min-w-[120px] rounded-xl border bg-card shadow-lg">
                <button
                  type="button"
                  role="menuitem"
                  onClick={logout}
                  className="w-full rounded-xl px-4 py-2.5 text-left text-sm font-medium text-destructive transition hover:bg-destructive/10"
                >
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
