import { Trophy } from "lucide-react"
import { useTeamTitles } from "../hooks/useTeamTitles"

export default function TeamName({
  teamId,
  name,
  className,
}: {
  teamId?: string
  name: string
  className?: string
}) {
  const { titlesOf } = useTeamTitles()
  const titles = titlesOf(teamId)
  return (
    <span className={className}>
      {name}
      {titles > 0 && (
        <span
          className="ml-1.5 inline-flex items-center gap-0.5 align-middle text-yellow-600 dark:text-yellow-400"
          title={`Campeão de ${titles} torneio${titles > 1 ? "s" : ""}`}
        >
          <Trophy className="h-4 w-4" />
          {titles > 1 && <span className="text-xs font-semibold">×{titles}</span>}
        </span>
      )}
    </span>
  )
}
