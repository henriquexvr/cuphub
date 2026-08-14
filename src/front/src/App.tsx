import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import Cadastro from "./pages/cadastro/Cadastro"
import Login from "./pages/login/Login"
import Home from "./pages/home/Home"
import Torneios from "./pages/torneios/Torneios"
import MeusTorneios from "./pages/torneios/MeusTorneios"
import ModeradorTorneios from "./pages/moderador/ModeradorTorneios"
import RevisarTorneio from "./pages/moderador/RevisarTorneios"
import Times from "./pages/times/Times"
import EditarTime from "./pages/times/EditarTime"
import TimeDetalhe from "./pages/times/TimeDetalhe"
import Dashboard from "./pages/dashboard/Dashboard"
import MinhasInscricoes from "./pages/dashboard/MinhasInscricoes"
import TorneioDetalhe from "./pages/torneios/TorneioDetalhe"
import Chaveamento from "./pages/torneios/Chaveamento"
import AceiteConvite from "./pages/convite/AceiteConvite"
import Indicadores from "./pages/indicadores/Indicadores"
import Admin from "./pages/admin/Admin"
import AdminUsuarios from "./pages/admin/AdminUsuarios"
import AdminTimes from "./pages/admin/AdminTimes"
import AdminTorneios from "./pages/admin/AdminTorneios"
import ProtectedRoute from "./components/ProtectedRoute"
import AppLayout from "./components/layout/AppLayout"
import { ThemeToggle } from "./components/ThemeToggle"

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/convite" element={<AceiteConvite />} />

          <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/inscricoes" element={<MinhasInscricoes />} />
            <Route path="/indicadores" element={<ProtectedRoute roles={["admin"]}><Indicadores /></ProtectedRoute>} />
            <Route path="/torneios" element={<Torneios />} />
            <Route path="/meus-torneios" element={<ProtectedRoute roles={["organizer", "admin"]}><MeusTorneios /></ProtectedRoute>} />
            <Route path="/torneios/:id" element={<TorneioDetalhe />} />
            <Route path="/torneios/:id/chaveamento" element={<Chaveamento />} />
            <Route path="/times" element={<Times />} />
            <Route path="/times/criar" element={<Times />} />
            <Route path="/times/:id" element={<TimeDetalhe />} />
            <Route path="/times/:id/editar" element={<EditarTime />} />
            <Route
              path="/moderador/torneios"
              element={<ProtectedRoute roles={["admin"]}><ModeradorTorneios /></ProtectedRoute>}
            />
            <Route
              path="/moderador/torneios/:id"
              element={<ProtectedRoute roles={["admin"]}><RevisarTorneio /></ProtectedRoute>}
            />
            <Route
              path="/admin"
              element={<ProtectedRoute roles={["admin"]}><Admin /></ProtectedRoute>}
            />
            <Route
              path="/admin/usuarios"
              element={<ProtectedRoute roles={["admin"]}><AdminUsuarios /></ProtectedRoute>}
            />
            <Route
              path="/admin/times"
              element={<ProtectedRoute roles={["admin"]}><AdminTimes /></ProtectedRoute>}
            />
            <Route
              path="/admin/torneios"
              element={<ProtectedRoute roles={["admin"]}><AdminTorneios /></ProtectedRoute>}
            />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <ThemeToggle />
    </>
  )
}
