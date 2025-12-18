import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import AdminHeader from "@/components/admin-header"
import { Plus, Calendar, MapPin } from "lucide-react"

export default async function MatchesManagementPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile || !["admin", "organizer"].includes(profile.role)) {
    redirect("/dashboard")
  }

  // Get all matches with team and championship info
  const { data: matches } = await supabase
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
    .order("match_date", { ascending: true })

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <AdminHeader userName={profile.full_name} />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Gerenciar Partidas</h2>
            <p className="text-muted-foreground">Agende e gerencie todas as partidas</p>
          </div>
          <Button asChild>
            <Link href="/admin/matches/new">
              <Plus className="mr-2 h-4 w-4" />
              Nova Partida
            </Link>
          </Button>
        </div>

        {matches && matches.length > 0 ? (
          <div className="space-y-4">
            {matches.map((match) => (
              <Card key={match.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="py-6">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getStatusColor(match.status)}>{getStatusLabel(match.status)}</Badge>
                        {match.championships && (
                          <span className="text-sm text-muted-foreground">{match.championships.name}</span>
                        )}
                      </div>
                      <div className="flex items-center justify-between max-w-md">
                        <p className="font-semibold text-right flex-1">{match.home_team?.name || "TBD"}</p>
                        <div className="px-4">
                          {match.status === "completed" ? (
                            <p className="font-bold">
                              {match.home_score} - {match.away_score}
                            </p>
                          ) : (
                            <Badge variant="outline">VS</Badge>
                          )}
                        </div>
                        <p className="font-semibold flex-1">{match.away_team?.name || "TBD"}</p>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
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
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{match.location}</span>
                          </div>
                        )}
                      </div>
                      {match.referee && (
                        <p className="text-sm text-muted-foreground mt-1">Árbitro: {match.referee.full_name}</p>
                      )}
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/matches/${match.id}`}>Gerenciar</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">Nenhuma partida cadastrada ainda</p>
              <Button asChild>
                <Link href="/admin/matches/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Agendar Primeira Partida
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
