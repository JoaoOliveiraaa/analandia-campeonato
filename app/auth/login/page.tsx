"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
        },
      })
      if (error) throw error
      router.push("/dashboard")
      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Erro ao fazer login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-[#1e3a8a] via-[#1e40af] to-[#2563eb]">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Link href="/" className="flex items-center gap-2 text-white hover:text-blue-200 transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-medium">Voltar</span>
          </Link>

          <div className="flex flex-col items-center gap-4 text-center">
            <div className="bg-white rounded-2xl p-4 shadow-2xl">
              <Image
                src="/logo.png"
                alt="Campeonato Municipal de Analândia"
                width={100}
                height={100}
                className="drop-shadow-lg"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">CAMPEONATO MUNICIPAL</h1>
              <p className="text-sm text-blue-200">Analândia - SP</p>
            </div>
          </div>

          <Card className="shadow-2xl border-0">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-2xl font-bold text-[#1e3a8a]">Acesso ao Sistema</CardTitle>
              <CardDescription className="text-base">Entre com suas credenciais para continuar</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin}>
                <div className="flex flex-col gap-5">
                  <div className="grid gap-2">
                    <Label htmlFor="email" className="text-sm font-semibold">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-11"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password" className="text-sm font-semibold">
                      Senha
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-11"
                    />
                  </div>
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}
                  <Button
                    type="submit"
                    className="w-full h-11 bg-[#16a34a] hover:bg-[#15803d] text-white font-semibold shadow-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? "Entrando..." : "Entrar no Sistema"}
                  </Button>
                </div>
                <div className="mt-6 text-center text-sm border-t pt-4">
                  <p className="text-muted-foreground mb-2">Ainda não tem cadastro?</p>
                  <Link
                    href="/auth/signup"
                    className="text-[#1e3a8a] hover:text-[#1e40af] font-semibold underline underline-offset-4"
                  >
                    Cadastre-se aqui
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>

          <p className="text-xs text-center text-blue-100">Sistema Oficial da Prefeitura Municipal de Analândia</p>
        </div>
      </div>
    </div>
  )
}
