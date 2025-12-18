import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Home, LogOut } from "lucide-react"
import Image from "next/image"

interface AdminHeaderProps {
  userName: string
}

export default function AdminHeader({ userName }: AdminHeaderProps) {
  const handleSignOut = async () => {
    "use server"
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect("/auth/login")
  }

  return (
    <header className="border-b bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Campeonato Municipal de Analândia"
            width={50}
            height={50}
            className="h-12 w-auto"
          />
          <div>
            <h1 className="text-lg font-bold text-[#1e3a8a]">Painel Administrativo</h1>
            <p className="text-xs text-muted-foreground">Analândia - SP</p>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground hidden md:inline">Olá, {userName}</span>
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard">
              <Home className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
          </Button>
          <form action={handleSignOut}>
            <Button variant="outline" size="sm">
              <LogOut className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </form>
        </div>
      </div>
    </header>
  )
}
