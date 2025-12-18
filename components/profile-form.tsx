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
import type { Profile } from "@/lib/types/database"
import { Heart } from "lucide-react"

interface ProfileFormProps {
  profile: Profile | null
  userEmail: string
  teams: Array<{ id: string; name: string }>
}

export default function ProfileForm({ profile, userEmail, teams }: ProfileFormProps) {
  const [fullName, setFullName] = useState(profile?.full_name || "")
  const [cpf, setCpf] = useState(profile?.cpf || "")
  const [phone, setPhone] = useState(profile?.phone || "")
  const [dateOfBirth, setDateOfBirth] = useState(profile?.date_of_birth || "")
  const [favoriteTeamId, setFavoriteTeamId] = useState(profile?.favorite_team_id || "none")
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
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error("Usuário não autenticado")

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          cpf: cpf || null,
          phone: phone || null,
          date_of_birth: dateOfBirth || null,
          favorite_team_id: favoriteTeamId === "none" ? null : favoriteTeamId,
        })
        .eq("id", user.id)

      if (error) throw error

      setSuccess(true)
      router.refresh()

      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Erro ao atualizar perfil")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações Pessoais</CardTitle>
        <CardDescription>Atualize seus dados cadastrais</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={userEmail} disabled />
            <p className="text-xs text-muted-foreground">O email não pode ser alterado</p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="fullName">Nome Completo *</Label>
            <Input
              id="fullName"
              type="text"
              placeholder="Seu nome completo"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="cpf">CPF</Label>
            <Input
              id="cpf"
              type="text"
              placeholder="000.000.000-00"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="(00) 00000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="dateOfBirth">Data de Nascimento</Label>
            <Input id="dateOfBirth" type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="favoriteTeam" className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-red-500" />
              Time do Coração
            </Label>
            <Select value={favoriteTeamId} onValueChange={setFavoriteTeamId}>
              <SelectTrigger id="favoriteTeam">
                <SelectValue placeholder="Selecione seu time favorito" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nenhum</SelectItem>
                {teams.map((team) => (
                  <SelectItem key={team.id} value={team.id}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">Escolha sua equipe favorita dos campeonatos</p>
          </div>

          <div className="grid gap-2">
            <Label>Tipo de Usuário</Label>
            <Input value={profile?.role || "athlete"} disabled className="capitalize" />
            <p className="text-xs text-muted-foreground">O tipo de usuário não pode ser alterado</p>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
          {success && <p className="text-sm text-green-600">Perfil atualizado com sucesso!</p>}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
