import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import PublicHeader from "@/components/public-header"
import { Calendar, Users, Trophy, MapPin } from "lucide-react"
import { notFound } from "next/navigation"

export default async function ChampionshipDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const { data: championship } = await supabase.from("championships").select("*").eq("id", params.id).single()

  if (!championship) {
    notFound()
  }

  // Get teams for this championship
  const { data: teams } = await supabase
    .from("teams")
    .select("*, profiles(full_name)")
    .eq("championship_id", params.id)
    .eq("registration_status", "approved")

  // Get matches for this championship
  const { data: matches } = await supabase
    .from("matches")
    .select("*, home_team:teams!matches_home_team_id_fkey(name), away_team:teams!matches_away_team_id_fkey(name)")
    .eq("championship_id", params.id)
    .order("match_date", { ascending: true })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-gray-500"
      case "registration_open":
        return "bg-blue-500"
      case "in_progress":
        return "bg-green-500"
      case "completed":
        return "bg-purple-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "upcoming":
        return "Em breve"
      case "registration_open":
        return "Inscrições abertas"
      case "in_progress":
        return "Em andamento"
      case "completed":
        return "Concluído"
      case "cancelled":
        return "Cancelado"
      default:
        return status
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <PublicHeader />

      <main className="container mx-auto px-4 py-8">
        {/* Championship Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">{championship.name}</h1>
              <Badge className={getStatusColor(championship.status)}>{getStatusLabel(championship.status)}</Badge>
            </div>
            {championship.status === "registration_open" && (
              <Button asChild size="lg">
                <Link href="/auth/signup">Inscrever Equipe</Link>
              </Button>
            )}
          </div>
          <p className="text-muted-foreground text-lg">{championship.description || "Campeonato municipal"}</p>
        </div>

        {/* Championship Info */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Modalidade</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{championship.sport}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Período</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                {new Date(championship.start_date).toLocaleDateString("pt-BR")}
                <br />
                até {new Date(championship.end_date).toLocaleDateString("pt-BR")}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Equipes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {teams?.length || 0}
                {championship.max_teams && `/${championship.max_teams}`}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Formato</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm capitalize">{championship.format?.replace("_", " ") || "A definir"}</div>
            </CardContent>
          </Card>
        </div>

        {/* Teams Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Equipes Participantes</h2>
          {teams && teams.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {teams.map((team) => (
                <Card key={team.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{team.name}</CardTitle>
                    <CardDescription>Técnico: {team.profiles?.full_name || "Não informado"}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">Nenhuma equipe inscrita ainda</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Matches Section */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Partidas</h2>
          {matches && matches.length > 0 ? (
            <div className="space-y-4">
              {matches.map((match) => (
                <Card key={match.id}>
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 text-right">
                        <p className="font-semibold">{match.home_team?.name || "TBD"}</p>
                        {match.status === "completed" && match.home_score !== null && (
                          <p className="text-2xl font-bold text-blue-600">{match.home_score}</p>
                        )}
                      </div>
                      <div className="px-6 text-center">
                        <Badge variant="outline">VS</Badge>
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(match.match_date).toLocaleDateString("pt-BR")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(match.match_date).toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{match.away_team?.name || "TBD"}</p>
                        {match.status === "completed" && match.away_score !== null && (
                          <p className="text-2xl font-bold text-green-600">{match.away_score}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">Nenhuma partida agendada ainda</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
