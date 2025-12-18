import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import PublicHeader from "@/components/public-header"
import { Trophy, Target, Shield, TrendingUp } from "lucide-react"
import Image from "next/image"

export default async function StatisticsPage() {
  const supabase = await createClient()

  // Get top scorers (players with most goals)
  const { data: topScorers } = await supabase
    .from("match_events")
    .select("player_id, profiles!match_events_player_id_fkey(full_name), team_id, teams(name)")
    .eq("event_type", "goal")
    .limit(1000)

  // Count goals per player
  const scorerStats = topScorers?.reduce(
    (acc, event) => {
      const playerId = event.player_id
      if (!playerId) return acc

      if (!acc[playerId]) {
        acc[playerId] = {
          player: event.profiles?.full_name || "Jogador desconhecido",
          team: event.teams?.name || "Equipe desconhecida",
          goals: 0,
        }
      }
      acc[playerId].goals += 1
      return acc
    },
    {} as Record<string, { player: string; team: string; goals: number }>,
  )

  const topScorersList = Object.values(scorerStats || {})
    .sort((a, b) => b.goals - a.goals)
    .slice(0, 10)

  // Get team statistics
  const { data: matches } = await supabase
    .from("matches")
    .select("*, home_team:teams!matches_home_team_id_fkey(name), away_team:teams!matches_away_team_id_fkey(name)")
    .eq("status", "completed")

  // Calculate team stats
  const teamStats = matches?.reduce(
    (acc, match) => {
      const homeTeamName = match.home_team?.name
      const awayTeamName = match.away_team?.name
      const homeScore = match.home_score || 0
      const awayScore = match.away_score || 0

      if (homeTeamName) {
        if (!acc[homeTeamName]) {
          acc[homeTeamName] = { name: homeTeamName, goalsScored: 0, goalsConceded: 0, matches: 0 }
        }
        acc[homeTeamName].goalsScored += homeScore
        acc[homeTeamName].goalsConceded += awayScore
        acc[homeTeamName].matches += 1
      }

      if (awayTeamName) {
        if (!acc[awayTeamName]) {
          acc[awayTeamName] = { name: awayTeamName, goalsScored: 0, goalsConceded: 0, matches: 0 }
        }
        acc[awayTeamName].goalsScored += awayScore
        acc[awayTeamName].goalsConceded += homeScore
        acc[awayTeamName].matches += 1
      }

      return acc
    },
    {} as Record<string, { name: string; goalsScored: number; goalsConceded: number; matches: number }>,
  )

  const bestDefenses = Object.values(teamStats || {})
    .filter((team) => team.matches > 0)
    .sort((a, b) => a.goalsConceded / a.matches - b.goalsConceded / b.matches)
    .slice(0, 10)

  const bestAttacks = Object.values(teamStats || {})
    .filter((team) => team.matches > 0)
    .sort((a, b) => b.goalsScored / b.matches - a.goalsScored / a.matches)
    .slice(0, 10)

  // Get championships stats
  const { count: championshipsCount } = await supabase.from("championships").select("*", { count: "exact", head: true })

  const { count: matchesCount } = await supabase.from("matches").select("*", { count: "exact", head: true })

  const { count: teamsCount } = await supabase.from("teams").select("*", { count: "exact", head: true })

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/50 to-slate-50">
      <PublicHeader />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="bg-gradient-to-r from-[#1e3a8a] to-[#2563eb] rounded-2xl shadow-lg p-8 mb-8 text-white text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <span className="text-sm font-bold">AD</span>
            </div>
            <p className="text-lg font-semibold">Espaço Publicitário Premium</p>
          </div>
          <p className="text-sm opacity-90">Apoie o esporte local com seu anúncio</p>
        </div>

        <div className="mb-8 flex items-center gap-4">
          <Image
            src="/logo.png"
            alt="Campeonato Municipal de Analândia"
            width={60}
            height={60}
            className="drop-shadow-lg hidden sm:block"
          />
          <div>
            <h1 className="text-4xl font-bold mb-2 text-[#1e3a8a]">Estatísticas</h1>
            <p className="text-slate-600">Números e recordes dos campeonatos de Analândia</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="border-l-4 border-l-[#1e3a8a]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Campeonatos</CardTitle>
              <Trophy className="h-4 w-4 text-[#1e3a8a]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#1e3a8a]">{championshipsCount || 0}</div>
              <p className="text-xs text-muted-foreground">total realizados</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-[#16a34a]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Partidas</CardTitle>
              <TrendingUp className="h-4 w-4 text-[#16a34a]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#16a34a]">{matchesCount || 0}</div>
              <p className="text-xs text-muted-foreground">jogos disputados</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Equipes</CardTitle>
              <Trophy className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">{teamsCount || 0}</div>
              <p className="text-xs text-muted-foreground">times cadastrados</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-[#16a34a]" />
                <CardTitle>Artilheiros</CardTitle>
              </div>
              <CardDescription>Jogadores com mais gols</CardDescription>
            </CardHeader>
            <CardContent>
              {topScorersList.length > 0 ? (
                <div className="space-y-3">
                  {topScorersList.map((scorer, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge className="bg-[#16a34a]">{index + 1}º</Badge>
                        <div>
                          <p className="font-medium">{scorer.player}</p>
                          <p className="text-xs text-muted-foreground">{scorer.team}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-[#16a34a]">{scorer.goals}</p>
                        <p className="text-xs text-muted-foreground">gols</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">Nenhum dado disponível ainda</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-[#1e3a8a]" />
                <CardTitle>Melhores Defesas</CardTitle>
              </div>
              <CardDescription>Equipes que menos sofrem gols</CardDescription>
            </CardHeader>
            <CardContent>
              {bestDefenses.length > 0 ? (
                <div className="space-y-3">
                  {bestDefenses.map((team, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge className="bg-[#1e3a8a]">{index + 1}º</Badge>
                        <div>
                          <p className="font-medium">{team.name}</p>
                          <p className="text-xs text-muted-foreground">{team.matches} jogos</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-[#1e3a8a]">
                          {(team.goalsConceded / team.matches).toFixed(1)}
                        </p>
                        <p className="text-xs text-muted-foreground">gols/jogo</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">Nenhum dado disponível ainda</p>
              )}
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-orange-500" />
                <CardTitle>Melhores Ataques</CardTitle>
              </div>
              <CardDescription>Equipes com melhor média de gols marcados</CardDescription>
            </CardHeader>
            <CardContent>
              {bestAttacks.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-3">
                  {bestAttacks.map((team, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge className="bg-orange-500">{index + 1}º</Badge>
                        <div>
                          <p className="font-medium">{team.name}</p>
                          <p className="text-xs text-muted-foreground">{team.matches} jogos</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-orange-500">
                          {(team.goalsScored / team.matches).toFixed(1)}
                        </p>
                        <p className="text-xs text-muted-foreground">gols/jogo</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">Nenhum dado disponível ainda</p>
              )}
            </CardContent>
          </Card>
        </div>

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
