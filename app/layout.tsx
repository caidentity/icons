import '@/styles/globals.scss'
import { Inter } from 'next/font/google'
import TopNavigation from '@/components/TopNavigation'
import Providers from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Icon Library',
  description: 'A collection of icons with controls',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <TopNavigation />
          <main className="min-h-screen bg-gray-50 pt-4">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
} 