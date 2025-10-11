import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { FooterView } from '@/components/footer/footer-view'
import { ViewModelProvider } from '@/lib/viewmodels/viewmodel-provider'
import { cookies } from 'next/headers'

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
  const theme = cookies().get('theme')?.value ?? 'light'
  const isDark = theme === 'dark'

  return (
    <html lang="en" className={isDark ? 'dark' : ''}>
      <body className={inter.className}>
        <ViewModelProvider>
          <div className="min-h-screen bg-background font-sans antialiased">
            <main>
              {children}
              <FooterView />
            </main>
          </div>
        </ViewModelProvider>
      </body>
    </html>
  )
}
