"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ChampionshipFormProps {
  userId: string
}

export default function ChampionshipForm({ userId }: ChampionshipFormProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [sport, setSport] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [registrationStart, setRegistrationStart] = useState("")
  const [registrationEnd, setRegistrationEnd] = useState("")
  const [maxTeams, setMaxTeams] = useState("")
  const [format, setFormat] = useState("round_robin")
  const [status, setStatus] = useState("upcoming")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.from("championships").insert({
        name,
        description: description || null,
        sport,
        start_date: startDate,
        end_date: endDate,
        registration_start: registrationStart,
        registration_end: registrationEnd,
        max_teams: maxTeams ? Number.parseInt(maxTeams) : null,
        format,
        status,
        created_by: userId,
      })

      if (error) throw error

      router.push("/admin/championships")
      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Erro ao criar campeonato")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações do Campeonato</CardTitle>
        <CardDescription>Preencha todos os campos obrigatórios (*)</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nome do Campeonato *</Label>
            <Input
              id="name"
              type="text"
              placeholder="Ex: Copa Municipal de Futebol 2025"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Descrição detalhada do campeonato"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="sport">Modalidade *</Label>
            <Input
              id="sport"
              type="text"
              placeholder="Ex: Futebol, Vôlei, Basquete"
              required
              value={sport}
              onChange={(e) => setSport(e.target.value)}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="startDate">Data de Início *</Label>
              <Input
                id="startDate"
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="endDate">Data de Término *</Label>
              <Input id="endDate" type="date" required value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="registrationStart">Início das Inscrições *</Label>
              <Input
                id="registrationStart"
                type="date"
                required
                value={registrationStart}
                onChange={(e) => setRegistrationStart(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="registrationEnd">Fim das Inscrições *</Label>
              <Input
                id="registrationEnd"
                type="date"
                required
                value={registrationEnd}
                onChange={(e) => setRegistrationEnd(e.target.value)}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="maxTeams">Número Máximo de Equipes</Label>
              <Input
                id="maxTeams"
                type="number"
                placeholder="Ex: 16"
                value={maxTeams}
                onChange={(e) => setMaxTeams(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="format">Formato</Label>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger id="format">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="round_robin">Pontos Corridos</SelectItem>
                  <SelectItem value="knockout">Eliminatória</SelectItem>
                  <SelectItem value="groups">Grupos + Eliminatória</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="upcoming">Em breve</SelectItem>
                <SelectItem value="registration_open">Inscrições abertas</SelectItem>
                <SelectItem value="in_progress">Em andamento</SelectItem>
                <SelectItem value="completed">Concluído</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex gap-2">
            <Button type="button" variant="outline" className="flex-1 bg-transparent" onClick={() => router.back()}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? "Criando..." : "Criar Campeonato"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
