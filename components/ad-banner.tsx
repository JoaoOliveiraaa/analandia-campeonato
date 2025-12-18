import { Card } from "@/components/ui/card"

interface AdBannerProps {
  size?: "horizontal" | "vertical" | "square"
  className?: string
}

export default function AdBanner({ size = "horizontal", className = "" }: AdBannerProps) {
  const dimensions = {
    horizontal: "h-24 w-full",
    vertical: "h-96 w-full",
    square: "h-64 w-full",
  }

  return (
    <Card
      className={`${dimensions[size]} ${className} bg-gradient-to-r from-blue-100 to-green-100 flex items-center justify-center border-2 border-dashed border-gray-300`}
    >
      <div className="text-center px-4">
        <p className="text-sm font-semibold text-gray-600">Espaço para Anúncio</p>
        <p className="text-xs text-gray-500 mt-1">Contato: anuncios@analandia.sp.gov.br</p>
      </div>
    </Card>
  )
}
