import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'File Translation App',
  description: 'Translate your files using DeepSeek API',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">{children}</body>
    </html>
  )
}
