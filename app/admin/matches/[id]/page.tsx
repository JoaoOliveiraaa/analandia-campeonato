import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import AdminHeader from "@/components/admin-header"
import MatchScoreForm from "@/components/match-score-form"
import MatchEventForm from "@/components/match-event-form" // Added import
import { notFound } from "next/navigation"
import { Calendar, MapPin, User } from "lucide-react"

export default async function MatchDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile || !["admin", "organizer", "referee"].includes(profile.role)) {
    redirect("/dashboard")
  }

  // Get match details
  const { data: match } = await supabase
    .from("matches")
    .select(
      `
      *,
      home_team:teams!matches_home_team_id_fkey(name),
      away_team:teams!matches_away_team_id_fkey(name),
      championships(name),
      referee:profiles(full_name)
    `,
    )
    .eq("id", params.id)
    .single()

  if (!match) {
    notFound()
  }

  // Get match events
  const { data: events } = await supabase
    .from("match_events")
    .select("*, teams(name), profiles(full_name)")
    .eq("match_id", params.id)
    .order("minute", { ascending: true })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-500"
      case "in_progress":
        return "bg-yellow-500"
      case "completed":
        return "bg-green-500"
      case "postponed":
        return "bg-orange-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "scheduled":
        return "Agendada"
      case "in_progress":
        return "Em andamento"
      case "completed":
        return "Finalizada"
      case "postponed":
        return "Adiada"
      case "cancelled":
        return "Cancelada"
      default:
        return status
    }
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case "goal":
        return "⚽"
      case "yellow_card":
        return "🟨"
      case "red_card":
        return "🟥"
      case "substitution":
        return "🔄"
      default:
        return "•"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader userName={profile.full_name} />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Match Header */}
        <div className="mb-8">
          <Badge className={getStatusColor(match.status)}>{getStatusLabel(match.status)}</Badge>
          <h1 className="text-3xl font-bold text-[#1e3a8a] mt-2">{match.championships?.name}</h1>
          {match.round && <p className="text-muted-foreground">{match.round}</p>}
        </div>

        {/* Match Score */}
        <Card className="mb-8">
          <CardContent className="py-8">
            <div className="flex items-center justify-between">
              <div className="flex-1 text-center">
                <p className="text-2xl font-bold mb-2">{match.home_team?.name || "TBD"}</p>
                {match.status === "completed" && match.home_score !== null && (
                  <p className="text-5xl font-bold text-blue-600">{match.home_score}</p>
                )}
              </div>
              <div className="px-8 text-center">
                <Badge variant="outline" className="text-lg px-4 py-2">
                  VS
                </Badge>
              </div>
              <div className="flex-1 text-center">
                <p className="text-2xl font-bold mb-2">{match.away_team?.name || "TBD"}</p>
                {match.status === "completed" && match.away_score !== null && (
                  <p className="text-5xl font-bold text-green-600">{match.away_score}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-center gap-6 mt-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(match.match_date).toLocaleDateString("pt-BR")} -{" "}
                  {new Date(match.match_date).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              {match.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{match.location}</span>
                </div>
              )}
              {match.referee && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{match.referee.full_name}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Score Management */}
        {match.status !== "completed" && match.status !== "cancelled" && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Gerenciar Resultado</CardTitle>
              <CardDescription>Atualize o placar e status da partida</CardDescription>
            </CardHeader>
            <CardContent>
              <MatchScoreForm match={match} />
            </CardContent>
          </Card>
        )}

        {/* Event Registration Form */}
        {match.status !== "completed" && match.status !== "cancelled" && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Registrar Evento</CardTitle>
              <CardDescription>Adicione gols, cartões, substituições e outros eventos</CardDescription>
            </CardHeader>
            <CardContent>
              <MatchEventForm matchId={match.id} homeTeamId={match.home_team_id} awayTeamId={match.away_team_id} />
            </CardContent>
          </Card>
        )}

        {/* Match Events */}
        {events && events.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Eventos da Partida</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {events.map((event) => (
                  <div key={event.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <span className="text-2xl">{getEventIcon(event.event_type)}</span>
                    <div className="flex-1">
                      <p className="font-medium">
                        {event.profiles?.full_name} - {event.teams?.name}
                      </p>
                      <p className="text-sm text-muted-foreground">{event.description || event.event_type}</p>
                    </div>
                    {event.minute && (
                      <Badge variant="outline" className="ml-auto">
                        {event.minute}'
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
