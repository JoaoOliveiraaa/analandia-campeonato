import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import AdminHeader from "@/components/admin-header"
import RefereeAssignmentForm from "@/components/referee-assignment-form"

export default async function RefereesManagementPage() {
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

  // Get all referees
  const { data: referees } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "referee")
    .order("full_name", { ascending: true })

  // Get referee assignments with championship info
  const { data: assignments } = await supabase
    .from("referee_assignments")
    .select("*, profiles(full_name), championships(name)")
    .order("created_at", { ascending: false })

  // Get active championships
  const { data: championships } = await supabase
    .from("championships")
    .select("*")
    .in("status", ["registration_open", "in_progress"])
    .order("name", { ascending: true })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-500"
      case "assigned":
        return "bg-blue-500"
      case "unavailable":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "available":
        return "Disponível"
      case "assigned":
        return "Escalado"
      case "unavailable":
        return "Indisponível"
      default:
        return status
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <AdminHeader userName={profile.full_name} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Escala de Árbitros</h2>
          <p className="text-muted-foreground">Gerencie a disponibilidade dos árbitros</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Referee List */}
          <div>
            <h3 className="text-xl font-bold mb-4">Árbitros Cadastrados</h3>
            {referees && referees.length > 0 ? (
              <div className="space-y-4">
                {referees.map((referee) => (
                  <Card key={referee.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{referee.full_name}</CardTitle>
                      <CardDescription>
                        Email: {referee.id}
                        {referee.phone && (
                          <>
                            <br />
                            Telefone: {referee.phone}
                          </>
                        )}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">Nenhum árbitro cadastrado</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Assignment Form */}
          <div>
            <h3 className="text-xl font-bold mb-4">Nova Escalação</h3>
            <RefereeAssignmentForm referees={referees || []} championships={championships || []} />

            {/* Current Assignments */}
            {assignments && assignments.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Escalações Recentes</h3>
                <div className="space-y-3">
                  {assignments.slice(0, 5).map((assignment) => (
                    <Card key={assignment.id}>
                      <CardContent className="py-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{assignment.profiles?.full_name}</p>
                            <p className="text-sm text-muted-foreground">{assignment.championships?.name}</p>
                          </div>
                          <Badge className={getStatusColor(assignment.status)}>
                            {getStatusLabel(assignment.status)}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
