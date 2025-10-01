import type React from "react"
import type { Metadata } from "next"
import { Crimson_Pro, Inter } from "next/font/google"
import "./globals.css"

const recoleta = Crimson_Pro({
  subsets: ["latin"],
  variable: "--font-recoleta",
  display: "swap",
  weight: ["400", "600", "700"],
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "SmartNote AI - Votre compagnon de pensée intelligent",
  description:
    "Une application de prise de notes alimentée par l'IA qui anticipe vos besoins et enrichit votre créativité.",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className={`${recoleta.variable} ${inter.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  )
}
