import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Calendar, Users } from "lucide-react"
import PublicHeader from "@/components/public-header"
import Image from "next/image"

export default async function ChampionshipsPage() {
  const supabase = await createClient()

  const { data: championships } = await supabase
    .from("championships")
    .select("*")
    .order("start_date", { ascending: false })

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
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/50 to-slate-50">
      <PublicHeader />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="bg-gradient-to-r from-[#1e3a8a] to-[#2563eb] rounded-2xl shadow-lg p-8 mb-8 text-white text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <span className="text-sm font-bold">AD</span>
            </div>
            <p className="text-lg font-semibold">Espaço Publicitário Premium</p>
          </div>
          <p className="text-sm opacity-90">Anuncie aqui e alcance toda a comunidade esportiva de Analândia</p>
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
            <h1 className="text-4xl font-bold mb-2 text-[#1e3a8a]">Campeonatos</h1>
            <p className="text-slate-600">Todos os campeonatos municipais de Analândia</p>
          </div>
        </div>

        <div className="flex gap-8">
          <aside className="hidden lg:block w-64 space-y-6">
            <div className="bg-gradient-to-br from-[#16a34a] to-[#22c55e] rounded-2xl shadow-lg p-6 h-96 flex flex-col items-center justify-center text-white text-center">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mb-3">
                <span className="font-bold">AD</span>
              </div>
              <p className="text-sm font-semibold mb-2">Anúncio Lateral</p>
              <p className="text-xs opacity-90">Espaço disponível</p>
            </div>
          </aside>

          <div className="flex-1">
            {championships && championships.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                {championships.map((championship, index) => (
                  <>
                    <Card
                      key={championship.id}
                      className="hover:shadow-xl transition-all border-2 border-blue-100 hover:border-[#1e3a8a]"
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          <Badge className={getStatusColor(championship.status)}>
                            {getStatusLabel(championship.status)}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg">{championship.name}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {championship.description || "Campeonato municipal"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="text-sm space-y-1">
                          <div className="flex items-center gap-2 text-slate-600">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {new Date(championship.start_date).toLocaleDateString("pt-BR")} -{" "}
                              {new Date(championship.end_date).toLocaleDateString("pt-BR")}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-600">
                            <Users className="h-4 w-4" />
                            <span>Modalidade: {championship.sport}</span>
                          </div>
                        </div>
                        <Button asChild className="w-full bg-[#1e3a8a] hover:bg-[#1e40af]" variant="default">
                          <Link href={`/championships/${championship.id}`}>Ver Detalhes</Link>
                        </Button>
                      </CardContent>
                    </Card>
                    {(index + 1) % 4 === 0 && (
                      <div className="md:col-span-2">
                        <div className="bg-gradient-to-r from-[#15803d] to-[#16a34a] rounded-2xl shadow-lg p-6 my-4 text-white text-center">
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
                  <p className="text-slate-600">Nenhum campeonato cadastrado</p>
                </CardContent>
              </Card>
            )}
          </div>

          <aside className="hidden xl:block w-64 space-y-6">
            <div className="bg-gradient-to-br from-[#1e40af] to-[#2563eb] rounded-2xl shadow-lg p-6 h-96 flex flex-col items-center justify-center text-white text-center">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mb-3">
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
