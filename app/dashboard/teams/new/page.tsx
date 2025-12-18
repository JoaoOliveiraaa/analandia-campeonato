import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import TeamRegistrationForm from "@/components/team-registration-form"

export default async function NewTeamPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Get championships with open registration
  const { data: championships } = await supabase
    .from("championships")
    .select("*")
    .eq("status", "registration_open")
    .order("name", { ascending: true })

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

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Cadastrar Nova Equipe</h1>
          <p className="text-muted-foreground">Inscreva sua equipe em um campeonato</p>
        </div>

        <TeamRegistrationForm userId={user.id} championships={championships || []} />
      </main>
    </div>
  )
}
