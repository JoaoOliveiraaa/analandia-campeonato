import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PublicHeader from "@/components/public-header"
import { Calendar, MapPin, ArrowLeft, Users, Clock } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function MatchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: match } = await supabase
    .from("matches")
    .select(
      `
      *,
      home_team:teams!matches_home_team_id_fkey(id, name),
      away_team:teams!matches_away_team_id_fkey(id, name),
      championship:championships(name),
      referee:profiles!matches_referee_id_fkey(full_name)
    `,
    )
    .eq("id", id)
    .single()

  if (!match) {
    notFound()
  }

  // Get match events
  const { data: events } = await supabase
    .from("match_events")
    .select("*, team:teams(name), player:profiles!match_events_player_id_fkey(full_name)")
    .eq("match_id", id)
    .order("minute", { ascending: true })

  // Get lineups
  const { data: homeLineup } = await supabase
    .from("match_lineups")
    .select("*, player:profiles!match_lineups_player_id_fkey(full_name)")
    .eq("match_id", id)
    .eq("team_id", match.home_team.id)
    .order("is_starter", { ascending: false })

  const { data: awayLineup } = await supabase
    .from("match_lineups")
    .select("*, player:profiles!match_lineups_player_id_fkey(full_name)")
    .eq("match_id", id)
    .eq("team_id", match.away_team.id)
    .order("is_starter", { ascending: false })

  const statusColors: Record<string, string> = {
    scheduled: "bg-blue-500",
    live: "bg-green-500",
    completed: "bg-gray-500",
    cancelled: "bg-red-500",
  }

  const statusLabels: Record<string, string> = {
    scheduled: "Agendada",
    live: "Ao Vivo",
    completed: "Encerrada",
    cancelled: "Cancelada",
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/50 to-slate-50">
      <PublicHeader />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <Button asChild variant="ghost" size="sm" className="mb-6">
          <Link href="/schedule">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Agenda
          </Link>
        </Button>

        <div className="bg-gradient-to-r from-[#1e3a8a] to-[#2563eb] rounded-2xl shadow-lg p-8 mb-8 text-white">
          <div className="text-center mb-6">
            <Badge className={`${statusColors[match.status]} text-white mb-2`}>{statusLabels[match.status]}</Badge>
            <h2 className="text-sm opacity-90">{match.championship?.name}</h2>
            <h3 className="text-lg opacity-90">{match.round}</h3>
          </div>

          <div className="flex items-center justify-between max-w-2xl mx-auto">
            <div className="text-center flex-1">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-2">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold">{match.home_team?.name}</h3>
            </div>

            <div className="text-center px-8">
              <div className="text-5xl font-bold">
                {match.home_score !== null ? match.home_score : "-"}
                <span className="mx-2">x</span>
                {match.away_score !== null ? match.away_score : "-"}
              </div>
            </div>

            <div className="text-center flex-1">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-2">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold">{match.away_team?.name}</h3>
            </div>
          </div>
        </div>

        <Tabs defaultValue="info" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info">Informações</TabsTrigger>
            <TabsTrigger value="lineup">Escalação</TabsTrigger>
            <TabsTrigger value="events">Eventos</TabsTrigger>
          </TabsList>

          <TabsContent value="info">
            <Card>
              <CardHeader>
                <CardTitle>Informações da Partida</CardTitle>
                <CardDescription>Detalhes sobre o jogo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-[#1e3a8a]" />
                    <div>
                      <p className="text-sm text-muted-foreground">Data e Hora</p>
                      <p className="font-medium">
                        {new Date(match.match_date).toLocaleDateString("pt-BR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}{" "}
                        às{" "}
                        {new Date(match.match_date).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <MapPin className="h-5 w-5 text-[#16a34a]" />
                    <div>
                      <p className="text-sm text-muted-foreground">Local</p>
                      <p className="font-medium">{match.location || "A definir"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <Users className="h-5 w-5 text-orange-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Árbitro</p>
                      <p className="font-medium">{match.referee?.full_name || "A definir"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <Clock className="h-5 w-5 text-purple-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <p className="font-medium">{statusLabels[match.status]}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lineup">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{match.home_team?.name}</CardTitle>
                  <CardDescription>Escalação titular e reservas</CardDescription>
                </CardHeader>
                <CardContent>
                  {homeLineup && homeLineup.length > 0 ? (
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-sm text-muted-foreground mb-2">TITULARES</h4>
                        <div className="space-y-2">
                          {homeLineup
                            .filter((p) => p.is_starter)
                            .map((player) => (
                              <div key={player.id} className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg">
                                <Badge className="bg-[#1e3a8a]">{player.jersey_number || "-"}</Badge>
                                <div className="flex-1">
                                  <p className="font-medium">{player.player?.full_name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {player.position || "Posição não definida"}
                                  </p>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                      {homeLineup.some((p) => !p.is_starter) && (
                        <div>
                          <h4 className="font-semibold text-sm text-muted-foreground mb-2">RESERVAS</h4>
                          <div className="space-y-2">
                            {homeLineup
                              .filter((p) => !p.is_starter)
                              .map((player) => (
                                <div key={player.id} className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg">
                                  <Badge variant="outline">{player.jersey_number || "-"}</Badge>
                                  <p className="font-medium">{player.player?.full_name}</p>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-8">Escalação não definida</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{match.away_team?.name}</CardTitle>
                  <CardDescription>Escalação titular e reservas</CardDescription>
                </CardHeader>
                <CardContent>
                  {awayLineup && awayLineup.length > 0 ? (
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-sm text-muted-foreground mb-2">TITULARES</h4>
                        <div className="space-y-2">
                          {awayLineup
                            .filter((p) => p.is_starter)
                            .map((player) => (
                              <div key={player.id} className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg">
                                <Badge className="bg-[#16a34a]">{player.jersey_number || "-"}</Badge>
                                <div className="flex-1">
                                  <p className="font-medium">{player.player?.full_name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {player.position || "Posição não definida"}
                                  </p>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                      {awayLineup.some((p) => !p.is_starter) && (
                        <div>
                          <h4 className="font-semibold text-sm text-muted-foreground mb-2">RESERVAS</h4>
                          <div className="space-y-2">
                            {awayLineup
                              .filter((p) => !p.is_starter)
                              .map((player) => (
                                <div key={player.id} className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg">
                                  <Badge variant="outline">{player.jersey_number || "-"}</Badge>
                                  <p className="font-medium">{player.player?.full_name}</p>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-8">Escalação não definida</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="events">
            <Card>
              <CardHeader>
                <CardTitle>Eventos da Partida</CardTitle>
                <CardDescription>Gols, cartões e substituições</CardDescription>
              </CardHeader>
              <CardContent>
                {events && events.length > 0 ? (
                  <div className="space-y-3">
                    {events.map((event) => {
                      const eventIcons: Record<string, string> = {
                        goal: "⚽",
                        yellow_card: "🟨",
                        red_card: "🟥",
                        substitution: "🔄",
                      }

                      const eventLabels: Record<string, string> = {
                        goal: "Gol",
                        yellow_card: "Cartão Amarelo",
                        red_card: "Cartão Vermelho",
                        substitution: "Substituição",
                      }

                      return (
                        <div key={event.id} className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
                          <Badge className="bg-[#1e3a8a]">{event.minute}'</Badge>
                          <span className="text-2xl">{eventIcons[event.event_type] || "📋"}</span>
                          <div className="flex-1">
                            <p className="font-medium">
                              {eventLabels[event.event_type]} - {event.team?.name}
                            </p>
                            <p className="text-sm text-muted-foreground">{event.player?.full_name}</p>
                            {event.description && (
                              <p className="text-xs text-muted-foreground mt-1">{event.description}</p>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">Nenhum evento registrado</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="bg-gradient-to-r from-[#16a34a] to-[#22c55e] rounded-2xl shadow-lg p-6 mt-8 text-white text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-sm font-bold">AD</span>
            </div>
            <p className="text-sm font-semibold">Espaço Publicitário</p>
          </div>
          <p className="text-xs opacity-80">Entre em contato: anuncios@analandia.sp.gov.br</p>
        </div>
      </main>
    </div>
  )
}
