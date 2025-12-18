import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import PublicHeader from "@/components/public-header"
import { Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default async function TeamsPage() {
  const supabase = await createClient()

  const { data: teams } = await supabase
    .from("teams")
    .select("*, championships(name), profiles(full_name)")
    .eq("registration_status", "approved")
    .order("name", { ascending: true })

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/50 to-slate-50">
      <PublicHeader />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="bg-gradient-to-r from-[#16a34a] to-[#22c55e] rounded-2xl shadow-lg p-8 mb-8 text-white text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <span className="text-sm font-bold">AD</span>
            </div>
            <p className="text-lg font-semibold">Espaço Publicitário Premium</p>
          </div>
          <p className="text-sm opacity-90">Apoie o esporte local com seu anúncio</p>
        </div>

        <div className="mb-8 flex items-center gap-4">
          <Image
            src="/logo.png"
            alt="Campeonato Municipal de Analândia"
            width={60}
            height={60}
            className="drop-shadow-lg hidden sm:block"
          />
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2 text-[#1e3a8a]">Equipes</h1>
            <p className="text-slate-600">Todas as equipes aprovadas nos campeonatos de Analândia</p>
          </div>
          <Button asChild className="bg-[#16a34a] hover:bg-[#16a34a]/90 text-white">
            <Link href="/dashboard/teams/new">
              <Users className="mr-2 h-4 w-4" />
              Criar Equipe
            </Link>
          </Button>
        </div>

        <div className="flex gap-8">
          <aside className="hidden lg:block w-64 space-y-6">
            <div className="bg-gradient-to-br from-[#1e3a8a] to-[#1e40af] rounded-2xl shadow-lg p-6 h-96 flex flex-col items-center justify-center text-white text-center">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mb-3">
                <span className="font-bold">AD</span>
              </div>
              <p className="text-sm font-semibold mb-2">Anúncio Lateral</p>
              <p className="text-xs opacity-90">Espaço disponível</p>
            </div>
          </aside>

          <div className="flex-1">
            {teams && teams.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                {teams.map((team, index) => (
                  <>
                    <Card
                      key={team.id}
                      className="hover:shadow-xl transition-all border-2 border-blue-100 hover:border-[#16a34a]"
                    >
                      <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                            <Users className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-lg">{team.name}</CardTitle>
                            <Badge variant="outline" className="mt-1">
                              Aprovada
                            </Badge>
                          </div>
                        </div>
                        <CardDescription>Campeonato: {team.championships?.name || "N/A"}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-slate-600">Técnico: {team.profiles?.full_name || "Não informado"}</p>
                      </CardContent>
                    </Card>
                    {(index + 1) % 6 === 0 && (
                      <div className="md:col-span-2">
                        <div className="bg-gradient-to-r from-[#2563eb] to-[#3b82f6] rounded-2xl shadow-lg p-6 my-4 text-white text-center">
                          <div className="flex items-center justify-center gap-3">
                            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                              <span className="text-sm font-bold">AD</span>
                            </div>
                            <p className="text-sm font-semibold">Espaço para Anúncio</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-slate-600">Nenhuma equipe aprovada ainda</p>
                </CardContent>
              </Card>
            )}
          </div>

          <aside className="hidden xl:block w-64 space-y-6">
            <div className="bg-gradient-to-br from-[#15803d] to-[#16a34a] rounded-2xl shadow-lg p-6 h-96 flex flex-col items-center justify-center text-white text-center">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mb-3">
                <span className="font-bold">AD</span>
              </div>
              <p className="text-sm font-semibold mb-2">Anúncio Lateral</p>
              <p className="text-xs opacity-90">Espaço disponível</p>
            </div>
          </aside>
        </div>

        <div className="bg-gradient-to-r from-[#1e3a8a] to-[#2563eb] rounded-2xl shadow-lg p-6 mt-8 text-white text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-sm font-bold">AD</span>
            </div>
            <p className="text-sm font-semibold">Espaço Publicitário</p>
          </div>
          <p className="text-xs opacity-80">Entre em contato: anuncios@analandia.sp.gov.br</p>
        </div>
      </main>
    </div>
  )
}
