export type TeamMember = {
  userId: string
  userName: string
  role: "captain" | "member"
}

export type Team = {
  id: string
  name: string
  description?: string
  bannerUrl?: string
  captainId: string
  captainName: string
  members: TeamMember[]
  createdAt: string
}
