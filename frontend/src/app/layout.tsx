import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: 'Portal de Transparência Pública',
  description: 'Sistema completo para transparência pública municipal em conformidade com LAI e LC 131/09',
  keywords: 'transparência, LAI, LC 131, município, governo, dados abertos',
  authors: [{ name: 'SaaS Transparência' }],
  robots: 'index, follow',
  openGraph: {
    title: 'Portal de Transparência Pública',
    description: 'Sistema completo para transparência pública municipal',
    type: 'website',
    locale: 'pt_BR',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#1976d2" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <div id="root">
          {children}
        </div>
      </body>
    </html>
  )
}

