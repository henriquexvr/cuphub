import { useTheme } from "./theme-provider"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const resolved =
    theme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : theme

  function toggle() {
    setTheme(resolved === "dark" ? "light" : "dark")
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Alternar tema"
      className="fixed bottom-5 right-5 z-50 flex size-11 items-center justify-center rounded-full border bg-card shadow-lg transition hover:bg-accent"
    >
      <span className="text-lg">{resolved === "dark" ? "☀️" : "🌙"}</span>
    </button>
  )
}
