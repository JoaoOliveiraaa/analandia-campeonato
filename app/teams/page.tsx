import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import AdminHeader from "@/components/admin-header"
import TeamApprovalButton from "@/components/team-approval-button"
import Link from "next/link"
import { Users } from "lucide-react"

export default async function TeamsManagementPage() {
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

  const { data: teams, error: teamsError } = await supabase
    .from("teams")
    .select("*")
    .order("created_at", { ascending: false })

  console.log("[v0] Teams fetched:", { count: teams?.length, error: teamsError, teams })

  // Se temos equipes, buscar dados relacionados separadamente
  let teamsWithDetails = teams || []
  if (teams && teams.length > 0) {
    // Buscar campeonatos
    const championshipIds = [...new Set(teams.map((t) => t.championship_id).filter(Boolean))]
    console.log("[v0] Championship IDs:", championshipIds)
    const { data: championships } = await supabase.from("championships").select("id, name").in("id", championshipIds)
    console.log("[v0] Championships fetched:", championships)

    // Buscar perfis (técnicos)
    const coachIds = [...new Set(teams.map((t) => t.coach_id).filter(Boolean))]
    console.log("[v0] Coach IDs:", coachIds)
    const { data: coaches } = await supabase.from("profiles").select("id, full_name").in("id", coachIds)
    console.log("[v0] Coaches fetched:", coaches)

    // Combinar os dados
    teamsWithDetails = teams.map((team) => ({
      ...team,
      championship_name: championships?.find((c) => c.id === team.championship_id)?.name,
      coach_name: coaches?.find((c) => c.id === team.coach_id)?.full_name,
    }))

    console.log("[v0] Teams with details:", { count: teamsWithDetails.length, teams: teamsWithDetails })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500"
      case "approved":
        return "bg-green-500"
      case "rejected":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendente"
      case "approved":
        return "Aprovada"
      case "rejected":
        return "Rejeitada"
      default:
        return status || "Sem status"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <AdminHeader userName={profile.full_name} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Gerenciar Equipes</h2>
          <p className="text-muted-foreground">Aprove ou rejeite inscrições de equipes</p>
          {teamsError && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">Erro ao buscar equipes: {teamsError.message}</p>
            </div>
          )}
        </div>

        {teamsWithDetails && teamsWithDetails.length > 0 ? (
          <div className="grid gap-6">
            {teamsWithDetails.map((team) => (
              <Card key={team.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle>{team.name}</CardTitle>
                      <CardDescription className="mt-1">
                        Campeonato: {team.championship_name || "N/A"}
                        <br />
                        Técnico: {team.coach_name || "Não informado"}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(team.registration_status)}>
                      {getStatusLabel(team.registration_status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <TeamApprovalButton teamId={team.id} currentStatus={team.registration_status} />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-16 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="rounded-full bg-blue-100 p-4">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">Nenhuma equipe encontrada</h3>
                  <p className="text-muted-foreground max-w-md">
                    Não foram encontradas equipes no banco de dados. Isso pode indicar um problema de permissões (RLS)
                    ou as equipes ainda não foram cadastradas.
                  </p>
                  <p className="text-xs text-gray-500 mt-4">
                    Debug: {teams?.length || 0} equipes na query | Error: {teamsError?.message || "nenhum"}
                  </p>
                </div>
                <Button asChild className="mt-2">
                  <Link href="/dashboard/teams/new">Cadastrar Nova Equipe</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
