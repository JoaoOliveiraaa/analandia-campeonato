"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"

interface TeamApprovalButtonProps {
  teamId: string
  currentStatus: string
}

export default function TeamApprovalButton({ teamId, currentStatus }: TeamApprovalButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleStatusChange = async (newStatus: string) => {
    const supabase = createClient()
    setIsLoading(true)

    try {
      const { error } = await supabase.from("teams").update({ registration_status: newStatus }).eq("id", teamId)

      if (error) throw error

      router.refresh()
    } catch (error) {
      console.error("Error updating team status:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (currentStatus === "pending") {
    return (
      <div className="flex gap-2">
        <Button
          onClick={() => handleStatusChange("approved")}
          disabled={isLoading}
          className="flex-1 bg-green-600 hover:bg-green-700"
        >
          <Check className="mr-2 h-4 w-4" />
          Aprovar
        </Button>
        <Button
          onClick={() => handleStatusChange("rejected")}
          disabled={isLoading}
          variant="destructive"
          className="flex-1"
        >
          <X className="mr-2 h-4 w-4" />
          Rejeitar
        </Button>
      </div>
    )
  }

  return (
    <Button onClick={() => handleStatusChange("pending")} disabled={isLoading} variant="outline" className="w-full">
      Reverter para Pendente
    </Button>
  )
}
