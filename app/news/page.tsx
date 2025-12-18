import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import PublicHeader from "@/components/public-header"
import { Calendar, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default async function NewsPage() {
  const supabase = await createClient()

  const { data: news } = await supabase
    .from("news")
    .select("*, championships(name), profiles(full_name)")
    .eq("published", true)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/50 to-slate-50">
      <PublicHeader />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="bg-gradient-to-r from-[#15803d] to-[#16a34a] rounded-2xl shadow-lg p-8 mb-8 text-white text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <span className="text-sm font-bold">AD</span>
            </div>
            <p className="text-lg font-semibold">Espaço Publicitário Premium</p>
          </div>
          <p className="text-sm opacity-90">Divulgue sua empresa nas notícias esportivas</p>
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
            <h1 className="text-4xl font-bold mb-2 text-[#1e3a8a]">Notícias</h1>
            <p className="text-slate-600">Fique por dentro das novidades dos campeonatos de Analândia</p>
          </div>
        </div>

        <div className="flex gap-8">
          <aside className="hidden lg:block w-64 space-y-6">
            <div className="bg-gradient-to-br from-[#2563eb] to-[#3b82f6] rounded-2xl shadow-lg p-6 h-96 flex flex-col items-center justify-center text-white text-center">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-3">
                <span className="font-bold">AD</span>
              </div>
              <p className="text-sm font-semibold mb-2">Anúncio Lateral</p>
              <p className="text-xs opacity-90">Espaço disponível</p>
            </div>
          </aside>

          <div className="flex-1">
            {news && news.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                {news.map((item, index) => (
                  <>
                    <Card
                      key={item.id}
                      className="hover:shadow-xl transition-all border-2 border-blue-100 hover:border-[#16a34a]"
                    >
                      <CardHeader>
                        {item.championships && (
                          <Badge className="w-fit mb-2" variant="outline">
                            {item.championships.name}
                          </Badge>
                        )}
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                        <CardDescription className="line-clamp-3">{item.content}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-4 text-sm text-slate-600">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span>{item.profiles?.full_name || "Admin"}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(item.created_at).toLocaleDateString("pt-BR")}</span>
                          </div>
                        </div>
                        <Button asChild className="w-full bg-[#1e3a8a] hover:bg-[#1e3a8a]/90">
                          <Link href={`/news/${item.id}`}>Ver Detalhes</Link>
                        </Button>
                      </CardContent>
                    </Card>
                    {(index + 1) % 4 === 0 && (
                      <div className="md:col-span-2">
                        <div className="bg-gradient-to-r from-[#1e40af] to-[#2563eb] rounded-2xl shadow-lg p-6 my-4 text-white text-center">
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
                  <p className="text-slate-600">Nenhuma notícia publicada ainda</p>
                </CardContent>
              </Card>
            )}
          </div>

          <aside className="hidden xl:block w-64 space-y-6">
            <div className="bg-gradient-to-br from-[#15803d] to-[#16a34a] rounded-2xl shadow-lg p-6 h-96 flex flex-col items-center justify-center text-white text-center">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-3">
                <span className="font-bold">AD</span>
              </div>
              <p className="text-sm font-semibold mb-2">Anúncio Lateral</p>
              <p className="text-xs opacity-90">Espaço disponível</p>
            </div>
          </aside>
        </div>

        <div className="bg-gradient-to-r from-[#16a34a] to-[#22c55e] rounded-2xl shadow-lg p-6 mt-8 text-white text-center">
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
