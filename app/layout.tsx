import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Asistente de Seguros',
  description: 'Chatbot inteligente para consultas sobre pólizas de seguros',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="font-body antialiased">
        {children}
      </body>
    </html>
  )
}
