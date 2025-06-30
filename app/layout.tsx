import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MatuTracker',
  description: 'App para trackear el contenido que consumo uwu',
  generator: 'MatuTracker',
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
