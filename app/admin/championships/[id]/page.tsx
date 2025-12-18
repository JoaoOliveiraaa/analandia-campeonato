import { redirect, notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import AdminHeader from "@/components/admin-header"
import { Calendar, Users, Trophy, Edit } from "lucide-react"

export default async function ChampionshipDetailPage({ params }: { params: { id: string } }) {
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

  // Get championship details
  const { data: championship } = await supabase.from("championships").select("*").eq("id", params.id).single()

  if (!championship) {
    notFound()
  }

  // Get teams in this championship
  const { data: teams } = await supabase
    .from("teams")
    .select("*")
    .eq("championship_id", params.id)
    .order("created_at", { ascending: false })

  // Get matches in this championship
  const { data: matches } = await supabase
    .from("matches")
    .select(`
      *,
      home_team:teams!matches_home_team_id_fkey(name),
      away_team:teams!matches_away_team_id_fkey(name)
    `)
    .eq("championship_id", params.id)
    .order("match_date", { ascending: true })

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      upcoming: "bg-gray-500",
      registration_open: "bg-blue-500",
      in_progress: "bg-green-500",
      completed: "bg-purple-500",
      cancelled: "bg-red-500",
      pending: "bg-yellow-500",
      approved: "bg-green-500",
      rejected: "bg-red-500",
      scheduled: "bg-blue-500",
    }
    return colors[status] || "bg-gray-500"
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      upcoming: "Em breve",
      registration_open: "Inscrições abertas",
      in_progress: "Em andamento",
      completed: "Concluído",
      cancelled: "Cancelado",
      pending: "Pendente",
      approved: "Aprovado",
      rejected: "Rejeitado",
      scheduled: "Agendada",
    }
    return labels[status] || status
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader userName={profile.full_name} />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Championship Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <Badge className={getStatusColor(championship.status)}>{getStatusLabel(championship.status)}</Badge>
              <h1 className="text-3xl font-bold text-[#1e3a8a] mt-2">{championship.name}</h1>
              <p className="text-muted-foreground mt-1">{championship.description}</p>
            </div>
            <Button asChild variant="outline">
              <Link href={`/admin/championships/${championship.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </Link>
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
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
                  {new Date(championship.start_date).toLocaleDateString("pt-BR")} até{" "}
                  {new Date(championship.end_date).toLocaleDateString("pt-BR")}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Equipes</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{teams?.length || 0}</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="teams" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="teams">Equipes ({teams?.length || 0})</TabsTrigger>
            <TabsTrigger value="matches">Partidas ({matches?.length || 0})</TabsTrigger>
          </TabsList>

          <TabsContent value="teams" className="space-y-4">
            {teams && teams.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {teams.map((team) => (
                  <Card key={team.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{team.name}</CardTitle>
                          <CardDescription>{team.coach_name}</CardDescription>
                        </div>
                        <Badge className={getStatusColor(team.status)}>{getStatusLabel(team.status)}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Button asChild variant="outline" size="sm" className="w-full bg-transparent">
                        <Link href={`/dashboard/teams/${team.id}`}>Ver Detalhes</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">Nenhuma equipe cadastrada neste campeonato</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="matches" className="space-y-4">
            {matches && matches.length > 0 ? (
              <div className="space-y-4">
                {matches.map((match) => (
                  <Card key={match.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="py-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center justify-between max-w-md mb-2">
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
                          <p className="text-sm text-muted-foreground">
                            {new Date(match.match_date).toLocaleDateString("pt-BR")} -{" "}
                            {new Date(match.match_date).toLocaleTimeString("pt-BR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
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
                  <p className="text-muted-foreground mb-4">Nenhuma partida agendada neste campeonato</p>
                  <Button asChild>
                    <Link href="/admin/matches/new">Agendar Partida</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
