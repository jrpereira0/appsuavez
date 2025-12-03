'use client'

import { SessionProvider } from 'next-auth/react'
import { signOut, useSession } from 'next-auth/react'
import { LogOut, User } from 'lucide-react'

function BarberHeader() {
  const { data: session } = useSession()

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6">
        {/* Lado esquerdo: Título */}
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900">
            Sistema de Fila
          </h1>
          {session?.user && (
            <div className="hidden sm:flex items-center gap-2 mt-0.5">
              <User className="w-3.5 h-3.5 text-gray-500" />
              <p className="text-xs text-gray-600">
                {session.user.name} · Barbeiro
              </p>
            </div>
          )}
        </div>

        {/* Lado direito: Botão sair */}
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="btn-ghost btn-sm flex-shrink-0"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Sair</span>
        </button>
      </div>

      {/* Info do usuário (mobile) */}
      {session?.user && (
        <div className="sm:hidden px-4 pb-2">
          <div className="flex items-center gap-2">
            <User className="w-3.5 h-3.5 text-gray-500" />
            <p className="text-xs text-gray-600">
              {session.user.name} · Barbeiro
            </p>
          </div>
        </div>
      )}
    </header>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <div className="min-h-screen bg-gray-50">
        <BarberHeader />
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </SessionProvider>
  )
}
