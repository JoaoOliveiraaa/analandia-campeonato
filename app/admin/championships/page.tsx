import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import AdminHeader from "@/components/admin-header"
import { Plus, Calendar, Users } from "lucide-react"

export default async function ChampionshipsManagementPage() {
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

  // Get all championships
  const { data: championships } = await supabase
    .from("championships")
    .select("*")
    .order("created_at", { ascending: false })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-gray-500"
      case "registration_open":
        return "bg-blue-500"
      case "in_progress":
        return "bg-green-500"
      case "completed":
        return "bg-purple-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "upcoming":
        return "Em breve"
      case "registration_open":
        return "Inscrições abertas"
      case "in_progress":
        return "Em andamento"
      case "completed":
        return "Concluído"
      case "cancelled":
        return "Cancelado"
      default:
        return status
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <AdminHeader userName={profile.full_name} />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Gerenciar Campeonatos</h2>
            <p className="text-muted-foreground">Visualize e edite todos os campeonatos</p>
          </div>
          <Button asChild>
            <Link href="/admin/championships/new">
              <Plus className="mr-2 h-4 w-4" />
              Novo Campeonato
            </Link>
          </Button>
        </div>

        {championships && championships.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {championships.map((championship) => (
              <Card key={championship.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{championship.name}</CardTitle>
                      <Badge className={getStatusColor(championship.status)}>
                        {getStatusLabel(championship.status)}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription className="line-clamp-2 mt-2">
                    {championship.description || "Sem descrição"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(championship.start_date).toLocaleDateString("pt-BR")} -{" "}
                        {new Date(championship.end_date).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>Modalidade: {championship.sport}</span>
                    </div>
                  </div>
                  <Button asChild className="w-full bg-transparent" variant="outline">
                    <Link href={`/admin/championships/${championship.id}`}>Ver Detalhes</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">Nenhum campeonato cadastrado ainda</p>
              <Button asChild>
                <Link href="/admin/championships/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Primeiro Campeonato
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
