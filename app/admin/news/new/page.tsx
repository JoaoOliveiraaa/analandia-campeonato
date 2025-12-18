import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import AdminHeader from "@/components/admin-header"
import NewsForm from "@/components/news-form"

export default async function NewNewsPage() {
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

  // Get championships
  const { data: championships } = await supabase.from("championships").select("*").order("name", { ascending: true })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <AdminHeader userName={profile.full_name} />

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Criar Nova Notícia</h2>
          <p className="text-muted-foreground">Publique informações sobre os campeonatos</p>
        </div>

        <NewsForm userId={user.id} championships={championships || []} />
      </main>
    </div>
  )
}
