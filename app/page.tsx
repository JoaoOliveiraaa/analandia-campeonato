import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Trophy, Users, Calendar, Newspaper, UserPlus, Shield } from "lucide-react"
import Image from "next/image"

export default async function HomePage() {
  const supabase = await createClient()

  // Get statistics
  const { count: championshipsCount } = await supabase
    .from("championships")
    .select("*", { count: "exact", head: true })
    .in("status", ["registration_open", "in_progress"])

  const { count: teamsCount } = await supabase.from("teams").select("*", { count: "exact", head: true })

  const { count: matchesCount } = await supabase
    .from("matches")
    .select("*", { count: "exact", head: true })
    .eq("status", "scheduled")
    .gte("match_date", new Date().toISOString())

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center md:justify-between">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Campeonato Municipal de Analândia"
                width={50}
                height={50}
                className="drop-shadow-lg"
              />
              <div className="text-[#1e3a8a]">
                <h1 className="text-lg md:text-xl font-bold tracking-tight">CAMPEONATO MUNICIPAL</h1>
                <p className="text-xs md:text-sm text-slate-600">Analândia - SP</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Logo Section */}
      <section className="bg-gradient-to-br from-white to-blue-50 py-10 px-4 border-b">
        <div className="container mx-auto text-center">
          <div className="inline-block mb-3">
            <Image
              src="/logo.png"
              alt="Campeonato Municipal de Analândia"
              width={140}
              height={140}
              className="mx-auto drop-shadow-2xl transform hover:scale-105 transition-transform"
            />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-[#1e3a8a] mb-2">Sistema de Gestão Esportiva</h2>
          <p className="text-sm text-muted-foreground">Prefeitura Municipal de Analândia</p>
        </div>
      </section>

      {/* Main Navigation Grid */}
      <section className="px-4 py-8">
        <div className="container mx-auto max-w-2xl">
          <div className="grid grid-cols-3 gap-4">
            {/* Competições */}
            <Link
              href="/championships"
              className="aspect-square bg-gradient-to-br from-[#1e3a8a] to-[#1e40af] rounded-3xl shadow-lg hover:shadow-2xl transition-all active:scale-95 flex flex-col items-center justify-center text-white p-4"
            >
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mb-3">
                <Trophy className="h-10 w-10" />
              </div>
              <span className="text-sm font-bold text-center">Competições</span>
            </Link>

            {/* Equipes */}
            <Link
              href="/teams"
              className="aspect-square bg-gradient-to-br from-[#2563eb] to-[#3b82f6] rounded-3xl shadow-lg hover:shadow-2xl transition-all active:scale-95 flex flex-col items-center justify-center text-white p-4"
            >
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mb-3">
                <Users className="h-10 w-10" />
              </div>
              <span className="text-sm font-bold text-center">Equipes</span>
            </Link>

            {/* Agenda */}
            <Link
              href="/schedule"
              className="aspect-square bg-gradient-to-br from-[#16a34a] to-[#22c55e] rounded-3xl shadow-lg hover:shadow-2xl transition-all active:scale-95 flex flex-col items-center justify-center text-white p-4"
            >
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mb-3">
                <Calendar className="h-10 w-10" />
              </div>
              <span className="text-sm font-bold text-center">Agenda</span>
            </Link>

            {/* Notícias */}
            <Link
              href="/news"
              className="aspect-square bg-gradient-to-br from-[#1e40af] to-[#2563eb] rounded-3xl shadow-lg hover:shadow-2xl transition-all active:scale-95 flex flex-col items-center justify-center text-white p-4"
            >
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mb-3">
                <Newspaper className="h-10 w-10" />
              </div>
              <span className="text-sm font-bold text-center">Notícias</span>
            </Link>

            {/* Inscrições */}
            <Link
              href="/auth/signup"
              className="aspect-square bg-gradient-to-br from-[#15803d] to-[#16a34a] rounded-3xl shadow-lg hover:shadow-2xl transition-all active:scale-95 flex flex-col items-center justify-center text-white p-4"
            >
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mb-3">
                <UserPlus className="h-10 w-10" />
              </div>
              <span className="text-sm font-bold text-center">Inscrições</span>
            </Link>

            {/* Acesso */}
            <Link
              href="/auth/login"
              className="aspect-square bg-gradient-to-br from-[#1e3a8a] to-[#1e40af] rounded-3xl shadow-lg hover:shadow-2xl transition-all active:scale-95 flex flex-col items-center justify-center text-white p-4"
            >
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mb-3">
                <Shield className="h-10 w-10" />
              </div>
              <span className="text-sm font-bold text-center">Acesso</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Advertisement Banner 1 */}
      <section className="px-4 py-6">
        <div className="container mx-auto max-w-2xl">
          <div className="bg-gradient-to-r from-[#1e3a8a] to-[#2563eb] rounded-2xl shadow-xl p-8 text-white text-center border-2 border-blue-300/20">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <span className="text-sm font-bold">AD</span>
              </div>
              <p className="text-base font-bold">ESPAÇO PUBLICITÁRIO PREMIUM</p>
            </div>
            <p className="text-sm opacity-90 font-medium">Anuncie aqui e apoie o esporte municipal de Analândia</p>
            <p className="text-xs opacity-75 mt-2">anuncios@analandia.sp.gov.br</p>
          </div>
        </div>
      </section>

      {/* Statistics Cards */}
      <section className="px-4 py-6">
        <div className="container mx-auto max-w-2xl">
          <h3 className="text-lg font-bold text-[#1e3a8a] mb-4 px-2">Estatísticas em Tempo Real</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-2xl shadow-md p-4 text-center border border-blue-100">
              <div className="text-3xl font-bold text-[#1e3a8a] mb-1">{championshipsCount || 0}</div>
              <div className="text-xs text-muted-foreground">Campeonatos Ativos</div>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-4 text-center border border-blue-100">
              <div className="text-3xl font-bold text-[#2563eb] mb-1">{teamsCount || 0}</div>
              <div className="text-xs text-muted-foreground">Equipes Cadastradas</div>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-4 text-center border border-green-100">
              <div className="text-3xl font-bold text-[#16a34a] mb-1">{matchesCount || 0}</div>
              <div className="text-xs text-muted-foreground">Jogos Agendados</div>
            </div>
          </div>
        </div>
      </section>

      {/* Advertisement Banner 2 */}
      <section className="px-4 py-6">
        <div className="container mx-auto max-w-2xl">
          <div className="bg-gradient-to-r from-[#15803d] to-[#16a34a] rounded-2xl shadow-xl p-8 text-white text-center border-2 border-green-300/20">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <span className="text-sm font-bold">AD</span>
              </div>
              <p className="text-base font-bold">PATROCINE O ESPORTE LOCAL</p>
            </div>
            <p className="text-sm opacity-90 font-medium">Sua marca em destaque nas competições de Analândia</p>
            <p className="text-xs opacity-75 mt-2">Entre em contato para mais informações</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-[#1e3a8a] to-[#1e40af] border-t border-blue-800 mt-12 py-8 px-4">
        <div className="container mx-auto text-center max-w-2xl">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Image
              src="/logo.png"
              alt="Campeonato Municipal de Analândia"
              width={48}
              height={48}
              className="drop-shadow-lg"
            />
          </div>
          <p className="text-sm font-bold text-white">Prefeitura Municipal de Analândia</p>
          <p className="text-xs text-blue-200 mt-1">Sistema Oficial de Gestão de Campeonatos</p>
          <p className="text-xs text-blue-300 mt-3">© 2025 Todos os direitos reservados</p>
        </div>
      </footer>
    </div>
  )
}
