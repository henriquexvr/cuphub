import { Navigate } from "react-router-dom"

interface Props {
  children: React.ReactNode
  roles?: string[]
}

export default function ProtectedRoute({ children, roles }: Props) {
  const token = localStorage.getItem("cuphub-token")
  const role = localStorage.getItem("cuphub-user-role") ?? ""

  if (!token) return <Navigate to="/login" replace />
  if (roles && roles.length > 0 && !roles.includes(role)) return <Navigate to="/dashboard" replace />
  return <>{children}</>
}
