import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Trophy, Users, Calendar, FileText, UserCheck } from "lucide-react"
import AdminHeader from "@/components/admin-header"

export default async function AdminPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Get user profile and check if admin or organizer
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile || !["admin", "organizer"].includes(profile.role)) {
    redirect("/dashboard")
  }

  // Get stats
  const { count: championshipsCount } = await supabase.from("championships").select("*", { count: "exact", head: true })
  const { count: teamsCount } = await supabase.from("teams").select("*", { count: "exact", head: true })
  const { count: matchesCount } = await supabase.from("matches").select("*", { count: "exact", head: true })
  const { count: newsCount } = await supabase.from("news").select("*", { count: "exact", head: true })
  const { count: usersCount } = await supabase.from("profiles").select("*", { count: "exact", head: true })

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader userName={profile.full_name} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-[#1e3a8a] mb-2">Painel de Controle</h2>
          <p className="text-muted-foreground">Gerencie todos os aspectos do Campeonato Municipal</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card className="border-l-4 border-l-[#1e3a8a] hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Campeonatos</CardTitle>
              <Trophy className="h-4 w-4 text-[#1e3a8a]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#1e3a8a]">{championshipsCount || 0}</div>
              <p className="text-xs text-muted-foreground">total de campeonatos</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-[#16a34a] hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Equipes</CardTitle>
              <Users className="h-4 w-4 text-[#16a34a]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#16a34a]">{teamsCount || 0}</div>
              <p className="text-xs text-muted-foreground">equipes cadastradas</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Partidas</CardTitle>
              <Calendar className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">{matchesCount || 0}</div>
              <p className="text-xs text-muted-foreground">partidas cadastradas</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Notícias</CardTitle>
              <FileText className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-500">{newsCount || 0}</div>
              <p className="text-xs text-muted-foreground">notícias publicadas</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuários</CardTitle>
              <UserCheck className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">{usersCount || 0}</div>
              <p className="text-xs text-muted-foreground">usuários cadastrados</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Gerenciamento</CardTitle>
              <CardDescription>Acesse as funcionalidades administrativas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild className="w-full justify-start bg-[#1e3a8a] hover:bg-[#1e3a8a]/90">
                <Link href="/admin/championships">
                  <Trophy className="mr-2 h-4 w-4" />
                  Gerenciar Campeonatos
                </Link>
              </Button>
              <Button asChild className="w-full justify-start bg-[#16a34a] hover:bg-[#16a34a]/90">
                <Link href="/admin/teams">
                  <Users className="mr-2 h-4 w-4" />
                  Aprovar Equipes
                </Link>
              </Button>
              <Button asChild className="w-full justify-start bg-orange-500 hover:bg-orange-600">
                <Link href="/admin/matches">
                  <Calendar className="mr-2 h-4 w-4" />
                  Gerenciar Partidas
                </Link>
              </Button>
              <Button asChild className="w-full justify-start bg-purple-500 hover:bg-purple-600">
                <Link href="/admin/news">
                  <FileText className="mr-2 h-4 w-4" />
                  Gerenciar Notícias
                </Link>
              </Button>
              <Button asChild className="w-full justify-start bg-blue-500 hover:bg-blue-600">
                <Link href="/admin/referees">
                  <UserCheck className="mr-2 h-4 w-4" />
                  Escala de Árbitros
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
              <CardDescription>Tarefas frequentes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild className="w-full bg-[#16a34a] hover:bg-[#16a34a]/90">
                <Link href="/admin/championships/new">+ Criar Novo Campeonato</Link>
              </Button>
              <Button asChild className="w-full bg-[#1e3a8a] hover:bg-[#1e3a8a]/90">
                <Link href="/admin/matches/new">+ Agendar Nova Partida</Link>
              </Button>
              <Button asChild className="w-full bg-purple-500 hover:bg-purple-600">
                <Link href="/admin/news/new">+ Publicar Notícia</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
