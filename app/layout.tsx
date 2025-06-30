import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MatuTracker',
  description: 'App para trackear el contenido que consumo uwu',
  generator: 'MatuTracker',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
