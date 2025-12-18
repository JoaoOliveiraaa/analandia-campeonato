"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Championship } from "@/lib/types/database"

interface TeamRegistrationFormProps {
  userId: string
  championships: Championship[]
}

export default function TeamRegistrationForm({ userId, championships }: TeamRegistrationFormProps) {
  const [teamName, setTeamName] = useState("")
  const [championshipId, setChampionshipId] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      // Check if team name already exists in this championship
      const { data: existingTeam } = await supabase
        .from("teams")
        .select("*")
        .eq("name", teamName)
        .eq("championship_id", championshipId)
        .single()

      if (existingTeam) {
        throw new Error("Já existe uma equipe com esse nome neste campeonato")
      }

      const { error } = await supabase.from("teams").insert({
        name: teamName,
        coach_id: userId,
        championship_id: championshipId,
        registration_status: "pending",
      })

      if (error) throw error

      router.push("/dashboard/teams")
      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Erro ao cadastrar equipe")
    } finally {
      setIsLoading(false)
    }
  }

  if (!championships || championships.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground mb-4">Não há campeonatos com inscrições abertas no momento</p>
          <Button asChild variant="outline">
            <a href="/championships">Ver Todos os Campeonatos</a>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações da Equipe</CardTitle>
        <CardDescription>Preencha os dados para inscrever sua equipe</CardDescription>
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
                    {championship.name} - {championship.sport}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="teamName">Nome da Equipe *</Label>
            <Input
              id="teamName"
              type="text"
              placeholder="Ex: FC Analândia"
              required
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Atenção:</strong> Após o cadastro, sua equipe ficará com status "Pendente" até ser aprovada pelos
              organizadores do campeonato.
            </p>
          </div>

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
              {isLoading ? "Cadastrando..." : "Cadastrar Equipe"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
