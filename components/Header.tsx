'use client'

import { signOut, useSession } from 'next-auth/react'
import { LogOut, User, Menu } from 'lucide-react'

interface HeaderProps {
  onMenuClick: () => void
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { data: session } = useSession()

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'OWNER':
        return 'Dono'
      case 'ADMIN':
        return 'Admin'
      case 'BARBER':
        return 'Barbeiro'
      default:
        return role
    }
  }

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6">
        {/* Lado esquerdo: Menu hamburger (mobile) + Título */}
        <div className="flex items-center gap-4">
          {/* Botão hamburger (apenas mobile) */}
          <button
            onClick={onMenuClick}
            className="lg:hidden text-gray-700 hover:text-gray-900"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Título */}
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">
              Sistema de Fila
            </h1>
            {session?.user && (
              <div className="hidden sm:flex items-center gap-2 mt-0.5">
                <User className="w-3.5 h-3.5 text-gray-500" />
                <p className="text-xs text-gray-600">
                  {session.user.name} · {getRoleLabel(session.user.role)}
                </p>
              </div>
            )}
          </div>
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
              {session.user.name} · {getRoleLabel(session.user.role)}
            </p>
          </div>
        </div>
      )}
    </header>
  )
}
