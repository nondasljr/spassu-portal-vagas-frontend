import { PropsWithChildren } from 'react'
import Header from './Header'

export default function AppLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}