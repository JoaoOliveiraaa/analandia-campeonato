import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Home } from "lucide-react"
import Image from "next/image"

export default function PublicHeader() {
  return (
    <header className="border-b bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Campeonato Municipal de Analândia"
              width={45}
              height={45}
              className="drop-shadow-md"
            />
            <div>
              <h1 className="text-xl font-bold text-[#1e3a8a]">Campeonato Municipal</h1>
              <p className="text-xs text-muted-foreground">Analândia - SP</p>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/championships"
              className="text-sm font-medium text-[#1e3a8a] hover:text-[#16a34a] transition-colors"
            >
              Campeonatos
            </Link>
            <Link href="/teams" className="text-sm font-medium text-[#1e3a8a] hover:text-[#16a34a] transition-colors">
              Equipes
            </Link>
            <Link
              href="/schedule"
              className="text-sm font-medium text-[#1e3a8a] hover:text-[#16a34a] transition-colors"
            >
              Calendário
            </Link>
            <Link href="/news" className="text-sm font-medium text-[#1e3a8a] hover:text-[#16a34a] transition-colors">
              Notícias
            </Link>
          </nav>
          <div className="flex gap-2">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="border-[#1e3a8a] text-[#1e3a8a] hover:bg-[#1e3a8a] hover:text-white bg-transparent"
            >
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Início
              </Link>
            </Button>
            <Button asChild size="sm" className="bg-[#16a34a] hover:bg-[#15803d]">
              <Link href="/auth/login">Entrar</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
