import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Campeonato Municipal de Analândia",
  description: "Sistema Oficial de Gestão Esportiva da Prefeitura Municipal de Analândia - SP",
  generator: "vexis",
  icons: {
    icon: [
      {
        url: "/analandia.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/analandia.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/analandia.png",
        type: "image/svg+xml",
      },
    ],
    apple: "/analandia.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
