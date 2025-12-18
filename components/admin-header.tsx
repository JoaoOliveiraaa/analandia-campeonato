import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Home, LogOut } from "lucide-react"

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
    <header className="border-b bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-blue-900">Campeonato Municipal - Admin</h1>
          <p className="text-sm text-muted-foreground">Analândia - SP</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground hidden md:inline">Olá, {userName}</span>
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard">
              <Home className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </Button>
          <form action={handleSignOut}>
            <Button variant="outline" size="sm">
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </form>
        </div>
      </div>
    </header>
  )
}
