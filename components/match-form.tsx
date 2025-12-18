"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Championship, Profile } from "@/lib/types/database"

interface MatchFormProps {
  championships: Championship[]
  referees: Profile[]
}

export default function MatchForm({ championships, referees }: MatchFormProps) {
  const [championshipId, setChampionshipId] = useState("")
  const [homeTeamId, setHomeTeamId] = useState("")
  const [awayTeamId, setAwayTeamId] = useState("")
  const [matchDate, setMatchDate] = useState("")
  const [matchTime, setMatchTime] = useState("")
  const [location, setLocation] = useState("")
  const [round, setRound] = useState("")
  const [refereeId, setRefereeId] = useState("")
  const [teams, setTeams] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Load teams when championship changes
  useEffect(() => {
    if (championshipId) {
      loadTeams(championshipId)
    } else {
      setTeams([])
      setHomeTeamId("")
      setAwayTeamId("")
    }
  }, [championshipId])

  const loadTeams = async (champId: string) => {
    const supabase = createClient()
    const { data } = await supabase
      .from("teams")
      .select("*")
      .eq("championship_id", champId)
      .eq("registration_status", "approved")
      .order("name")

    setTeams(data || [])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      if (homeTeamId === awayTeamId) {
        throw new Error("As equipes mandante e visitante não podem ser iguais")
      }

      // Combine date and time
      const matchDateTime = new Date(`${matchDate}T${matchTime}:00`)

      const { error } = await supabase.from("matches").insert({
        championship_id: championshipId,
        home_team_id: homeTeamId,
        away_team_id: awayTeamId,
        match_date: matchDateTime.toISOString(),
        location: location || null,
        round: round || null,
        referee_id: refereeId || null,
        status: "scheduled",
      })

      if (error) throw error

      router.push("/admin/matches")
      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Erro ao agendar partida")
    } finally {
      setIsLoading(false)
    }
  }

  if (!championships || championships.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">Não há campeonatos ativos no momento</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações da Partida</CardTitle>
        <CardDescription>Preencha todos os campos obrigatórios (*)</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="championship">Campeonato *</Label>
            <Select value={championshipId} onValueChange={setChampionshipId} required>
              <SelectTrigger id="championship">
                <SelectValue placeholder="Selecione um campeonato" />
              </SelectTrigger>
              <SelectContent>
                {championships.map((championship) => (
                  <SelectItem key={championship.id} value={championship.id}>
                    {championship.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {championshipId && teams.length === 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">Nenhuma equipe aprovada neste campeonato ainda</p>
            </div>
          )}

          {teams.length > 0 && (
            <>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="homeTeam">Equipe Mandante *</Label>
                  <Select value={homeTeamId} onValueChange={setHomeTeamId} required>
                    <SelectTrigger id="homeTeam">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {teams.map((team) => (
                        <SelectItem key={team.id} value={team.id}>
                          {team.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="awayTeam">Equipe Visitante *</Label>
                  <Select value={awayTeamId} onValueChange={setAwayTeamId} required>
                    <SelectTrigger id="awayTeam">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {teams.map((team) => (
                        <SelectItem key={team.id} value={team.id}>
                          {team.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="matchDate">Data da Partida *</Label>
                  <Input
                    id="matchDate"
                    type="date"
                    required
                    value={matchDate}
                    onChange={(e) => setMatchDate(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="matchTime">Horário *</Label>
                  <Input
                    id="matchTime"
                    type="time"
                    required
                    value={matchTime}
                    onChange={(e) => setMatchTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="location">Local</Label>
                <Input
                  id="location"
                  type="text"
                  placeholder="Ex: Estádio Municipal"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="round">Rodada/Fase</Label>
                <Input
                  id="round"
                  type="text"
                  placeholder="Ex: Rodada 1, Quartas de Final"
                  value={round}
                  onChange={(e) => setRound(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="referee">Árbitro</Label>
                <Select value={refereeId} onValueChange={setRefereeId}>
                  <SelectTrigger id="referee">
                    <SelectValue placeholder="Selecione um árbitro (opcional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {referees.map((referee) => (
                      <SelectItem key={referee.id} value={referee.id}>
                        {referee.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => router.back()}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1" disabled={isLoading}>
                  {isLoading ? "Agendando..." : "Agendar Partida"}
                </Button>
              </div>
            </>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
