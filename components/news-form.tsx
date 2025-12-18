"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import type { Championship } from "@/lib/types/database"

interface NewsFormProps {
  userId: string
  championships: Championship[]
}

export default function NewsForm({ userId, championships }: NewsFormProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [championshipId, setChampionshipId] = useState("none")
  const [published, setPublished] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.from("news").insert({
        title,
        content,
        championship_id: championshipId === "none" ? null : championshipId,
        author_id: userId,
        published,
      })

      if (error) throw error

      router.push("/admin/news")
      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Erro ao criar notícia")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações da Notícia</CardTitle>
        <CardDescription>Preencha os campos para criar uma notícia</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              type="text"
              placeholder="Digite o título da notícia"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="content">Conteúdo *</Label>
            <Textarea
              id="content"
              placeholder="Digite o conteúdo da notícia"
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="championship">Campeonato (opcional)</Label>
            <Select value={championshipId} onValueChange={setChampionshipId}>
              <SelectTrigger id="championship">
                <SelectValue placeholder="Selecione um campeonato" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nenhum</SelectItem>
                {championships.map((championship) => (
                  <SelectItem key={championship.id} value={championship.id}>
                    {championship.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="published"
              checked={published}
              onCheckedChange={(checked) => setPublished(checked === true)}
            />
            <Label
              htmlFor="published"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Publicar imediatamente
            </Label>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? "Criando..." : "Criar Notícia"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
