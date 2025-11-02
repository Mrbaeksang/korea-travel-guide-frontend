'use client'

import { usePathname } from 'next/navigation'
import { Header } from './header'
import { Footer } from './footer'

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname()

  // Auth 페이지에서는 헤더/푸터를 표시하지 않음
  const isAuthPage =
    pathname.startsWith('/login') ||
    pathname.startsWith('/signup') ||
    pathname.startsWith('/oauth')

  if (isAuthPage) {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
