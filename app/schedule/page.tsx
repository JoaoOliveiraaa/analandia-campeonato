import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import PublicHeader from "@/components/public-header"
import { Calendar } from "lucide-react"
import Image from "next/image"

export default async function SchedulePage() {
  const supabase = await createClient()

  const { data: matches } = await supabase
    .from("matches")
    .select(
      "*, home_team:teams!matches_home_team_id_fkey(name), away_team:teams!matches_away_team_id_fkey(name), championships(name)",
    )
    .order("match_date", { ascending: true })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-500"
      case "in_progress":
        return "bg-yellow-500"
      case "completed":
        return "bg-green-500"
      case "postponed":
        return "bg-orange-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "scheduled":
        return "Agendada"
      case "in_progress":
        return "Em andamento"
      case "completed":
        return "Finalizada"
      case "postponed":
        return "Adiada"
      case "cancelled":
        return "Cancelada"
      default:
        return status
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/50 to-slate-50">
      <PublicHeader />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="bg-gradient-to-r from-[#1e40af] to-[#2563eb] rounded-2xl shadow-lg p-8 mb-8 text-white text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <span className="text-sm font-bold">AD</span>
            </div>
            <p className="text-lg font-semibold">Espaço Publicitário Premium</p>
          </div>
          <p className="text-sm opacity-90">Destaque sua marca nos jogos de Analândia</p>
        </div>

        <div className="mb-8 flex items-center gap-4">
          <Image
            src="/logo.png"
            alt="Campeonato Municipal de Analândia"
            width={60}
            height={60}
            className="drop-shadow-lg hidden sm:block"
          />
          <div>
            <h1 className="text-4xl font-bold mb-2 text-[#1e3a8a]">Calendário de Partidas</h1>
            <p className="text-slate-600">Todas as partidas agendadas e resultados de Analândia</p>
          </div>
        </div>

        <div className="flex gap-8">
          <aside className="hidden lg:block w-64 space-y-6">
            <div className="bg-gradient-to-br from-[#16a34a] to-[#22c55e] rounded-2xl shadow-lg p-6 h-96 flex flex-col items-center justify-center text-white text-center">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-3">
                <span className="font-bold">AD</span>
              </div>
              <p className="text-sm font-semibold mb-2">Anúncio Lateral</p>
              <p className="text-xs opacity-90">Espaço disponível</p>
            </div>
          </aside>

          <div className="flex-1">
            {matches && matches.length > 0 ? (
              <div className="space-y-4">
                {matches.map((match, index) => (
                  <>
                    <Card
                      key={match.id}
                      className="hover:shadow-xl transition-all border-2 border-blue-100 hover:border-[#1e3a8a]"
                    >
                      <CardContent className="py-6">
                        <div className="flex flex-col md:flex-row items-center gap-4">
                          <div className="flex-1 text-center md:text-right">
                            <p className="font-semibold text-lg">{match.home_team?.name || "TBD"}</p>
                            {match.status === "completed" && match.home_score !== null && (
                              <p className="text-3xl font-bold text-blue-600">{match.home_score}</p>
                            )}
                          </div>

                          <div className="flex flex-col items-center px-6 min-w-[200px]">
                            <Badge className={getStatusColor(match.status)}>{getStatusLabel(match.status)}</Badge>
                            <div className="flex items-center gap-2 mt-2 text-slate-600">
                              <Calendar className="h-4 w-4" />
                              <span className="text-sm">{new Date(match.match_date).toLocaleDateString("pt-BR")}</span>
                            </div>
                            <p className="text-sm text-slate-600">
                              {new Date(match.match_date).toLocaleTimeString("pt-BR", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                            {match.championships && (
                              <p className="text-xs text-slate-600 mt-2 text-center">{match.championships.name}</p>
                            )}
                            {match.location && <p className="text-xs text-slate-600 text-center">{match.location}</p>}
                          </div>

                          <div className="flex-1 text-center md:text-left">
                            <p className="font-semibold text-lg">{match.away_team?.name || "TBD"}</p>
                            {match.status === "completed" && match.away_score !== null && (
                              <p className="text-3xl font-bold text-green-600">{match.away_score}</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    {(index + 1) % 5 === 0 && (
                      <div className="bg-gradient-to-r from-[#15803d] to-[#16a34a] rounded-2xl shadow-lg p-6 my-4 text-white text-center">
                        <div className="flex items-center justify-center gap-3">
                          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                            <span className="text-sm font-bold">AD</span>
                          </div>
                          <p className="text-sm font-semibold">Espaço para Anúncio</p>
                        </div>
                      </div>
                    )}
                  </>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-slate-600">Nenhuma partida agendada</p>
                </CardContent>
              </Card>
            )}
          </div>

          <aside className="hidden xl:block w-64 space-y-6">
            <div className="bg-gradient-to-br from-[#1e3a8a] to-[#2563eb] rounded-2xl shadow-lg p-6 h-96 flex flex-col items-center justify-center text-white text-center">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-3">
                <span className="font-bold">AD</span>
              </div>
              <p className="text-sm font-semibold mb-2">Anúncio Lateral</p>
              <p className="text-xs opacity-90">Espaço disponível</p>
            </div>
          </aside>
        </div>

        <div className="bg-gradient-to-r from-[#1e3a8a] to-[#1e40af] rounded-2xl shadow-lg p-6 mt-8 text-white text-center">
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
