import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, Plus, UserPlus } from "lucide-react"
import { notFound } from "next/navigation"

export default async function TeamDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Get team details
  const { data: team } = await supabase
    .from("teams")
    .select("*, championships(name, sport, status)")
    .eq("id", params.id)
    .eq("coach_id", user.id)
    .single()

  if (!team) {
    notFound()
  }

  // Get team members
  const { data: members } = await supabase
    .from("team_members")
    .select("*, profiles(full_name, cpf)")
    .eq("team_id", params.id)
    .order("jersey_number", { ascending: true })

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
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard/teams">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Team Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{team.name}</h1>
              <Badge className={getStatusColor(team.registration_status)}>
                {getStatusLabel(team.registration_status)}
              </Badge>
            </div>
          </div>
          <p className="text-muted-foreground">
            Campeonato: {team.championships?.name || "N/A"} - {team.championships?.sport || "N/A"}
          </p>
        </div>

        {/* Team Info */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Informações da Equipe</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm font-medium">Nome</p>
              <p className="text-sm text-muted-foreground">{team.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Campeonato</p>
              <p className="text-sm text-muted-foreground">{team.championships?.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Status da Inscrição</p>
              <p className="text-sm text-muted-foreground">{getStatusLabel(team.registration_status)}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Total de Atletas</p>
              <p className="text-sm text-muted-foreground">{members?.length || 0}</p>
            </div>
          </CardContent>
        </Card>

        {/* Team Members */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Atletas</h2>
            <Button asChild size="sm">
              <Link href={`/dashboard/teams/${params.id}/add-member`}>
                <UserPlus className="mr-2 h-4 w-4" />
                Adicionar Atleta
              </Link>
            </Button>
          </div>

          {members && members.length > 0 ? (
            <div className="grid gap-4">
              {members.map((member) => (
                <Card key={member.id}>
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {member.jersey_number && (
                          <div className="h-12 w-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                            {member.jersey_number}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold">{member.profiles?.full_name || "Sem nome"}</p>
                          <p className="text-sm text-muted-foreground">
                            {member.position || "Posição não definida"}
                            {member.is_captain && " • Capitão"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground mb-4">Nenhum atleta cadastrado ainda</p>
                <Button asChild>
                  <Link href={`/dashboard/teams/${params.id}/add-member`}>
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Primeiro Atleta
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
