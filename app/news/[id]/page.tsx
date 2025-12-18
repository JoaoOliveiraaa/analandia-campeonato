import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import PublicHeader from "@/components/public-header"
import { Calendar, User, ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: newsItem } = await supabase
    .from("news")
    .select("*, championships(name), profiles(full_name)")
    .eq("id", id)
    .eq("published", true)
    .single()

  if (!newsItem) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/50 to-slate-50">
      <PublicHeader />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Button asChild variant="ghost" size="sm" className="mb-6">
          <Link href="/news">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Notícias
          </Link>
        </Button>

        <div className="bg-gradient-to-r from-[#15803d] to-[#16a34a] rounded-2xl shadow-lg p-8 mb-8 text-white text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <span className="text-sm font-bold">AD</span>
            </div>
            <p className="text-lg font-semibold">Espaço Publicitário Premium</p>
          </div>
          <p className="text-sm opacity-90">Apoie o esporte local com seu anúncio</p>
        </div>

        <Card className="border-2 border-blue-100">
          <CardContent className="p-8">
            {newsItem.championships && (
              <Badge className="mb-4" variant="secondary">
                {newsItem.championships.name}
              </Badge>
            )}

            <h1 className="text-4xl font-bold mb-6 text-[#1e3a8a] text-balance">{newsItem.title}</h1>

            <div className="flex items-center gap-6 mb-8 text-sm text-slate-600 border-b pb-4">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <span className="font-medium">{newsItem.profiles?.full_name || "Admin"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>
                  {new Date(newsItem.created_at).toLocaleDateString("pt-BR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            {newsItem.image_url && (
              <div className="mb-8 rounded-lg overflow-hidden">
                <Image
                  src={newsItem.image_url || "/placeholder.svg"}
                  alt={newsItem.title}
                  width={800}
                  height={400}
                  className="w-full h-auto object-cover"
                />
              </div>
            )}

            <div className="prose prose-lg max-w-none">
              <p className="text-slate-700 leading-relaxed whitespace-pre-line">{newsItem.content}</p>
            </div>
          </CardContent>
        </Card>

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
