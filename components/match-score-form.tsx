"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface MatchScoreFormProps {
  match: any
}

export default function MatchScoreForm({ match }: MatchScoreFormProps) {
  const [homeScore, setHomeScore] = useState(match.home_score?.toString() || "0")
  const [awayScore, setAwayScore] = useState(match.away_score?.toString() || "0")
  const [status, setStatus] = useState(match.status)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase
        .from("matches")
        .update({
          home_score: Number.parseInt(homeScore),
          away_score: Number.parseInt(awayScore),
          status,
        })
        .eq("id", match.id)

      if (error) throw error

      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Erro ao atualizar resultado")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="homeScore">Placar Mandante</Label>
          <Input
            id="homeScore"
            type="number"
            min="0"
            value={homeScore}
            onChange={(e) => setHomeScore(e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="awayScore">Placar Visitante</Label>
          <Input
            id="awayScore"
            type="number"
            min="0"
            value={awayScore}
            onChange={(e) => setAwayScore(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="status">Status da Partida</Label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger id="status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="scheduled">Agendada</SelectItem>
            <SelectItem value="in_progress">Em andamento</SelectItem>
            <SelectItem value="completed">Finalizada</SelectItem>
            <SelectItem value="postponed">Adiada</SelectItem>
            <SelectItem value="cancelled">Cancelada</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Salvando..." : "Salvar Resultado"}
      </Button>
    </form>
  )
}
