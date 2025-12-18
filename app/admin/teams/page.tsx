import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import AdminHeader from "@/components/admin-header"
import TeamApprovalButton from "@/components/team-approval-button"

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

  // Get all teams with championship info
  const { data: teams } = await supabase
    .from("teams")
    .select("*, championships(name), profiles(full_name)")
    .order("created_at", { ascending: false })

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
        return status
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <AdminHeader userName={profile.full_name} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Gerenciar Equipes</h2>
          <p className="text-muted-foreground">Aprove ou rejeite inscrições de equipes</p>
        </div>

        {teams && teams.length > 0 ? (
          <div className="grid gap-6">
            {teams.map((team) => (
              <Card key={team.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle>{team.name}</CardTitle>
                      <CardDescription className="mt-1">
                        Campeonato: {team.championships?.name || "N/A"}
                        <br />
                        Técnico: {team.profiles?.full_name || "Não informado"}
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
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Nenhuma equipe cadastrada ainda</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
