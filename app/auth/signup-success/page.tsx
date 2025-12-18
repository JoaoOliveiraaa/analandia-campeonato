import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle2 } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-blue-50 to-green-50">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-16 w-16 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Cadastro Realizado!</CardTitle>
            <CardDescription>Confirme seu email para ativar sua conta</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Enviamos um email de confirmação para o endereço cadastrado. Clique no link do email para ativar sua conta
              e fazer login no sistema.
            </p>
            <Button asChild className="w-full">
              <Link href="/auth/login">Voltar para o Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
