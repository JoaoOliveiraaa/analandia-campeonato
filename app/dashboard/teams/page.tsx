import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, Plus } from "lucide-react"

export default async function MyTeamsPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Get teams where user is the coach
  const { data: teams } = await supabase
    .from("teams")
    .select("*, championships(name, status)")
    .eq("coach_id", user.id)
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
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Minhas Equipes</h1>
            <p className="text-muted-foreground">Gerencie suas equipes cadastradas</p>
          </div>
          <Button asChild>
            <Link href="/dashboard/teams/new">
              <Plus className="mr-2 h-4 w-4" />
              Nova Equipe
            </Link>
          </Button>
        </div>

        {teams && teams.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {teams.map((team) => (
              <Card key={team.id}>
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-lg">{team.name}</CardTitle>
                    <Badge className={getStatusColor(team.registration_status)}>
                      {getStatusLabel(team.registration_status)}
                    </Badge>
                  </div>
                  <CardDescription>
                    Campeonato: {team.championships?.name || "N/A"}
                    <br />
                    Status: {team.championships?.status || "N/A"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full bg-transparent" variant="outline">
                    <Link href={`/dashboard/teams/${team.id}`}>Gerenciar Equipe</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">Você ainda não cadastrou nenhuma equipe</p>
              <Button asChild>
                <Link href="/dashboard/teams/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Cadastrar Primeira Equipe
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
