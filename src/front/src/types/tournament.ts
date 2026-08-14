export type TournamentStatus =
  | "draft"
  | "pending_approval"
  | "approved"
  | "rejected"
  | "registration_open"
  | "in_progress"
  | "finished"

export type Tournament = {
  id: string
  name: string
  description?: string
  bannerUrl?: string
  startDate: string
  endDate: string
  maxTeams: number
  pointsWin: number
  pointsDraw: number
  pointsLoss: number
  notes?: string
  rejectionReason?: string
  status: TournamentStatus
  organizer?: { id: string; name: string; email: string; role: string }
  createdAt: string
}

export type Match = {
  id: string
  tournamentId: string
  round: number
  position: number
  homeTeamId?: string
  homeTeamName?: string
  awayTeamId?: string
  awayTeamName?: string
  homeScore?: number
  awayScore?: number
  status: "scheduled" | "finished"
  winnerId?: string
  winnerName?: string
  scheduledAt?: string
}

export const STATUS_LABELS: Record<TournamentStatus, string> = {
  draft: "Rascunho",
  pending_approval: "Aguardando aprovação",
  approved: "Aprovado",
  rejected: "Reprovado",
  registration_open: "Inscrições abertas",
  in_progress: "Em andamento",
  finished: "Finalizado",
}

export const STATUS_COLORS: Record<TournamentStatus, string> = {
  draft: "border-border text-muted-foreground",
  pending_approval: "border-yellow-500/30 bg-yellow-500/10 text-yellow-700",
  approved: "border-green-500/30 bg-green-500/10 text-green-700",
  rejected: "border-destructive/30 bg-destructive/10 text-destructive",
  registration_open: "border-blue-500/30 bg-blue-500/10 text-blue-700",
  in_progress: "border-purple-500/30 bg-purple-500/10 text-purple-700",
  finished: "border-border text-muted-foreground",
}

export const REGISTRATION_STATUS_COLORS: Record<string, string> = {
  pending: "border-yellow-500/30 bg-yellow-500/10 text-yellow-700",
  approved: "border-green-500/30 bg-green-500/10 text-green-700",
  rejected: "border-destructive/30 bg-destructive/10 text-destructive",
}
