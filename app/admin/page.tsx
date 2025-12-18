import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Trophy, Users, Calendar, FileText, UserCheck, Settings } from "lucide-react"
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <AdminHeader userName={profile.full_name} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Painel Administrativo</h2>
          <p className="text-muted-foreground">Gerencie todos os aspectos do campeonato municipal</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Campeonatos</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{championshipsCount || 0}</div>
              <p className="text-xs text-muted-foreground">total de campeonatos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Equipes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{teamsCount || 0}</div>
              <p className="text-xs text-muted-foreground">equipes cadastradas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Partidas</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{matchesCount || 0}</div>
              <p className="text-xs text-muted-foreground">partidas cadastradas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Notícias</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{newsCount || 0}</div>
              <p className="text-xs text-muted-foreground">notícias publicadas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuários</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usersCount || 0}</div>
              <p className="text-xs text-muted-foreground">usuários cadastrados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Configurações</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" size="sm" className="w-full bg-transparent">
                <Link href="/admin/settings">Acessar</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento</CardTitle>
              <CardDescription>Acesse as funcionalidades administrativas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild className="w-full justify-start bg-transparent" variant="outline">
                <Link href="/admin/championships">
                  <Trophy className="mr-2 h-4 w-4" />
                  Gerenciar Campeonatos
                </Link>
              </Button>
              <Button asChild className="w-full justify-start bg-transparent" variant="outline">
                <Link href="/admin/teams">
                  <Users className="mr-2 h-4 w-4" />
                  Aprovar Equipes
                </Link>
              </Button>
              <Button asChild className="w-full justify-start bg-transparent" variant="outline">
                <Link href="/admin/matches">
                  <Calendar className="mr-2 h-4 w-4" />
                  Gerenciar Partidas
                </Link>
              </Button>
              <Button asChild className="w-full justify-start bg-transparent" variant="outline">
                <Link href="/admin/news">
                  <FileText className="mr-2 h-4 w-4" />
                  Gerenciar Notícias
                </Link>
              </Button>
              <Button asChild className="w-full justify-start bg-transparent" variant="outline">
                <Link href="/admin/referees">
                  <UserCheck className="mr-2 h-4 w-4" />
                  Escala de Árbitros
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
              <CardDescription>Tarefas frequentes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild className="w-full">
                <Link href="/admin/championships/new">Criar Novo Campeonato</Link>
              </Button>
              <Button asChild className="w-full" variant="secondary">
                <Link href="/admin/matches/new">Agendar Nova Partida</Link>
              </Button>
              <Button asChild className="w-full" variant="secondary">
                <Link href="/admin/news/new">Publicar Notícia</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
