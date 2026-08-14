export type UserRole = "participant" | "organizer" | "admin"

export function useAuth() {
  const userId = localStorage.getItem("cuphub-user-id") ?? ""
  const name = localStorage.getItem("cuphub-user-name") ?? "Usuário"
  const role = (localStorage.getItem("cuphub-user-role") ?? "participant") as UserRole

  function logout() {
    localStorage.clear()
    window.location.href = "/login"
  }

  return { userId, name, role, logout }
}
