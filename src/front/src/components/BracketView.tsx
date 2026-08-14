import {
  ReactFlow,
  Background,
  Controls,
  Handle,
  Position,
  type NodeProps,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { useMemo } from "react"
import type { Match } from "../types/tournament"

const NODE_W = 220
const NODE_H = 90
const H_GAP = 80
const V_GAP = 20

function MatchNode({ data }: NodeProps) {
  const match = data as unknown as Match

  const homeWon = match.winnerId && match.winnerId === match.homeTeamId
  const awayWon = match.winnerId && match.winnerId === match.awayTeamId

  return (
    <div
      className="rounded-xl border bg-card text-sm shadow-sm overflow-hidden"
      style={{ width: NODE_W }}
    >
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <div className={`flex items-center justify-between px-3 py-2 border-b ${homeWon ? "bg-green-500/10" : ""}`}>
        <span className={`truncate max-w-[150px] ${homeWon ? "font-bold" : ""} ${!match.homeTeamName ? "italic text-muted-foreground" : ""}`}>
          {match.homeTeamName ?? "A definir"}
        </span>
        <span className="font-mono font-bold ml-2 tabular-nums">
          {match.status === "finished" ? (match.homeScore ?? 0) : "\u2013"}
        </span>
      </div>
      <div className={`flex items-center justify-between px-3 py-2 ${awayWon ? "bg-green-500/10" : ""}`}>
        <span className={`truncate max-w-[150px] ${awayWon ? "font-bold" : ""} ${!match.awayTeamName ? "italic text-muted-foreground" : ""}`}>
          {match.awayTeamName ?? "A definir"}
        </span>
        <span className="font-mono font-bold ml-2 tabular-nums">
          {match.status === "finished" ? (match.awayScore ?? 0) : "\u2013"}
        </span>
      </div>
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
    </div>
  )
}

const nodeTypes = { match: MatchNode }

interface Props {
  matches: Match[]
}

export function BracketView({ matches }: Props) {
  const { nodes, edges } = useMemo(() => {
    const nodes = matches.map((match) => {
      const spacing = (NODE_H + V_GAP) * Math.pow(2, match.round - 1)
      const y = (match.position - 1) * spacing + spacing / 2 - NODE_H / 2

      return {
        id: match.id,
        type: "match" as const,
        position: { x: (match.round - 1) * (NODE_W + H_GAP), y },
        data: match,
      }
    })

    const edges = matches
      .filter((m) => m.round > 1)
      .flatMap((match) => {
        const prevRound = match.round - 1
        const pos1 = match.position * 2 - 1
        const pos2 = match.position * 2
        const src1 = matches.find((m) => m.round === prevRound && m.position === pos1)
        const src2 = matches.find((m) => m.round === prevRound && m.position === pos2)
        return [
          src1 && { id: `e-${src1.id}-${match.id}`, source: src1.id, target: match.id, animated: src1.status !== "finished" },
          src2 && { id: `e-${src2.id}-${match.id}`, source: src2.id, target: match.id, animated: src2.status !== "finished" },
        ].filter(Boolean)
      }) as { id: string; source: string; target: string; animated: boolean }[]

    return { nodes, edges }
  }, [matches])

  const maxY = Math.max(...nodes.map((n) => n.position.y + NODE_H), 400)

  return (
    <div style={{ height: maxY + 80 }} className="w-full rounded-xl border overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        minZoom={0.3}
      >
        <Background />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  )
}
