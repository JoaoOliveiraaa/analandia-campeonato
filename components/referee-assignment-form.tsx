"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Championship, Profile } from "@/lib/types/database"

interface RefereeAssignmentFormProps {
  referees: Profile[]
  championships: Championship[]
}

export default function RefereeAssignmentForm({ referees, championships }: RefereeAssignmentFormProps) {
  const [refereeId, setRefereeId] = useState("")
  const [championshipId, setChampionshipId] = useState("")
  const [status, setStatus] = useState("available")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      // Check if assignment already exists
      const { data: existing } = await supabase
        .from("referee_assignments")
        .select("*")
        .eq("referee_id", refereeId)
        .eq("championship_id", championshipId)
        .single()

      if (existing) {
        // Update existing assignment
        const { error } = await supabase
          .from("referee_assignments")
          .update({ status })
          .eq("referee_id", refereeId)
          .eq("championship_id", championshipId)

        if (error) throw error
      } else {
        // Create new assignment
        const { error } = await supabase.from("referee_assignments").insert({
          referee_id: refereeId,
          championship_id: championshipId,
          status,
        })

        if (error) throw error
      }

      setSuccess(true)
      setRefereeId("")
      setChampionshipId("")
      setStatus("available")
      router.refresh()

      setTimeout(() => setSuccess(false), 3000)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Erro ao criar escalação")
    } finally {
      setIsLoading(false)
    }
  }

  if (!referees || referees.length === 0 || !championships || championships.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">
            {!referees || referees.length === 0 ? "Nenhum árbitro cadastrado" : "Nenhum campeonato ativo no momento"}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Escalar Árbitro</CardTitle>
        <CardDescription>Defina a disponibilidade do árbitro para um campeonato</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="referee">Árbitro *</Label>
            <Select value={refereeId} onValueChange={setRefereeId} required>
              <SelectTrigger id="referee">
                <SelectValue placeholder="Selecione um árbitro" />
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

          <div className="grid gap-2">
            <Label htmlFor="status">Status *</Label>
            <Select value={status} onValueChange={setStatus} required>
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Disponível</SelectItem>
                <SelectItem value="assigned">Escalado</SelectItem>
                <SelectItem value="unavailable">Indisponível</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
          {success && <p className="text-sm text-green-600">Escalação criada com sucesso!</p>}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Salvando..." : "Salvar Escalação"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
