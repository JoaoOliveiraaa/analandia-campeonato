import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import AdminHeader from "@/components/admin-header"
import MatchForm from "@/components/match-form"

export default async function NewMatchPage() {
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
  const { data: championships } = await supabase
    .from("championships")
    .select("*")
    .in("status", ["registration_open", "in_progress"])
    .order("name", { ascending: true })

  // Get referees
  const { data: referees } = await supabase.from("profiles").select("*").eq("role", "referee").order("full_name")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <AdminHeader userName={profile.full_name} />

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Agendar Nova Partida</h2>
          <p className="text-muted-foreground">Preencha as informações da partida</p>
        </div>

        <MatchForm championships={championships || []} referees={referees || []} />
      </main>
    </div>
  )
}
