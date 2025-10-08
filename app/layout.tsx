import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { FooterView } from '@/components/footer/footer-view'

import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Papr',
  description:
    'Discover and reference scientific publications with the power of AI. Search, store, and reference research papers like never before.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-background font-sans antialiased">
          <main>{children}</main>
          <FooterView />
        </div>
      </body>
    </html>
  )
}
