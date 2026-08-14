import { useEffect, useState } from "react"
import api from "../service/api"

type TitlesMap = Record<string, number>

let cache: TitlesMap | null = null
let inflight: Promise<TitlesMap> | null = null

function load(): Promise<TitlesMap> {
  if (cache) return Promise.resolve(cache)
  if (!inflight) {
    inflight = api
      .get<TitlesMap>("/api/teams/titles")
      .then((res) => {
        cache = res.data ?? {}
        return cache
      })
      .catch(() => {
        cache = {}
        return cache
      })
  }
  return inflight
}

export function useTeamTitles() {
  const [titles, setTitles] = useState<TitlesMap>(cache ?? {})
  useEffect(() => {
    load().then(setTitles)
  }, [])
  return {
    titlesOf: (teamId?: string) => (teamId ? titles[teamId] ?? 0 : 0),
  }
}
