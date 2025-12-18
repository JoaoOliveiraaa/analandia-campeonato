"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface MatchEventFormProps {
  matchId: string
  homeTeamId: string
  awayTeamId: string
}

export default function MatchEventForm({ matchId, homeTeamId, awayTeamId }: MatchEventFormProps) {
  const [loading, setLoading] = useState(false)
  const [eventType, setEventType] = useState("")
  const [teamId, setTeamId] = useState("")
  const [minute, setMinute] = useState("")
  const [playerId, setPlayerId] = useState("")
  const [description, setDescription] = useState("")
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.from("match_events").insert({
        match_id: matchId,
        team_id: teamId,
        player_id: playerId || null,
        event_type: eventType,
        minute: Number.parseInt(minute),
        description: description || null,
      })

      if (error) throw error

      // Reset form
      setEventType("")
      setTeamId("")
      setMinute("")
      setPlayerId("")
      setDescription("")

      router.refresh()
    } catch (error) {
      console.error("Error creating event:", error)
      alert("Erro ao registrar evento")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="event-type">Tipo de Evento *</Label>
          <Select value={eventType} onValueChange={setEventType} required>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="goal">⚽ Gol</SelectItem>
              <SelectItem value="yellow_card">🟨 Cartão Amarelo</SelectItem>
              <SelectItem value="red_card">🟥 Cartão Vermelho</SelectItem>
              <SelectItem value="substitution">🔄 Substituição</SelectItem>
              <SelectItem value="injury">🚑 Lesão</SelectItem>
              <SelectItem value="other">📌 Outro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="team">Equipe *</Label>
          <Select value={teamId} onValueChange={setTeamId} required>
            <SelectTrigger>
              <SelectValue placeholder="Selecione a equipe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={homeTeamId}>Time da Casa</SelectItem>
              <SelectItem value={awayTeamId}>Time Visitante</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="minute">Minuto *</Label>
          <Input
            id="minute"
            type="number"
            min="0"
            max="120"
            value={minute}
            onChange={(e) => setMinute(e.target.value)}
            placeholder="Ex: 45"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="player">ID do Jogador (opcional)</Label>
          <Input
            id="player"
            value={playerId}
            onChange={(e) => setPlayerId(e.target.value)}
            placeholder="ID do jogador"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição (opcional)</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ex: Gol de cabeça após escanteio"
          rows={3}
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full bg-[#16a34a] hover:bg-[#16a34a]/90">
        {loading ? "Registrando..." : "Registrar Evento"}
      </Button>
    </form>
  )
}
