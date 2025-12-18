import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import AdminHeader from "@/components/admin-header"
import { Plus, Eye, EyeOff } from "lucide-react"

export default async function NewsManagementPage() {
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

  // Get all news
  const { data: news } = await supabase
    .from("news")
    .select("*, championships(name), profiles(full_name)")
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <AdminHeader userName={profile.full_name} />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Gerenciar Notícias</h2>
            <p className="text-muted-foreground">Crie e publique notícias sobre os campeonatos</p>
          </div>
          <Button asChild>
            <Link href="/admin/news/new">
              <Plus className="mr-2 h-4 w-4" />
              Nova Notícia
            </Link>
          </Button>
        </div>

        {news && news.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {news.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant={item.published ? "default" : "outline"}>
                      {item.published ? (
                        <>
                          <Eye className="mr-1 h-3 w-3" />
                          Publicada
                        </>
                      ) : (
                        <>
                          <EyeOff className="mr-1 h-3 w-3" />
                          Rascunho
                        </>
                      )}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">{item.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{item.content}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground mb-4">
                    <p>Autor: {item.profiles?.full_name || "Desconhecido"}</p>
                    {item.championships && <p>Campeonato: {item.championships.name}</p>}
                    <p>Criada em: {new Date(item.created_at).toLocaleDateString("pt-BR")}</p>
                  </div>
                  <Button asChild className="w-full bg-transparent" variant="outline">
                    <Link href={`/admin/news/${item.id}`}>Editar</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">Nenhuma notícia cadastrada ainda</p>
              <Button asChild>
                <Link href="/admin/news/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Primeira Notícia
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
