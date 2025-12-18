export type UserRole = "athlete" | "coach" | "organizer" | "referee" | "admin"

export type ChampionshipStatus = "upcoming" | "registration_open" | "in_progress" | "completed" | "cancelled"

export type RegistrationStatus = "pending" | "approved" | "rejected"

export type MatchStatus = "scheduled" | "in_progress" | "completed" | "postponed" | "cancelled"

export type EventType = "goal" | "yellow_card" | "red_card" | "substitution"

export interface Profile {
  id: string
  full_name: string
  cpf: string | null
  phone: string | null
  date_of_birth: string | null
  role: UserRole
  created_at: string
  updated_at: string
}

export interface Championship {
  id: string
  name: string
  description: string | null
  sport: string
  start_date: string
  end_date: string
  registration_start: string
  registration_end: string
  status: ChampionshipStatus
  max_teams: number | null
  format: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface Team {
  id: string
  name: string
  logo_url: string | null
  coach_id: string | null
  championship_id: string
  registration_status: RegistrationStatus
  created_at: string
  updated_at: string
}

export interface TeamMember {
  id: string
  team_id: string
  athlete_id: string
  jersey_number: number | null
  position: string | null
  is_captain: boolean
  created_at: string
}

export interface Match {
  id: string
  championship_id: string
  home_team_id: string
  away_team_id: string
  match_date: string
  location: string | null
  round: string | null
  home_score: number | null
  away_score: number | null
  status: MatchStatus
  referee_id: string | null
  created_at: string
  updated_at: string
}

export interface MatchEvent {
  id: string
  match_id: string
  team_id: string
  player_id: string
  event_type: EventType
  minute: number | null
  description: string | null
  created_at: string
}

export interface News {
  id: string
  title: string
  content: string
  image_url: string | null
  author_id: string | null
  championship_id: string | null
  published: boolean
  created_at: string
  updated_at: string
}

export interface RefereeAssignment {
  id: string
  referee_id: string
  championship_id: string
  status: "available" | "assigned" | "unavailable"
  created_at: string
}
