'use client'

import { useBarbers } from '@/hooks/useBarbers'
import BarberCard from './BarberCard'
import { Users, Pause } from 'lucide-react'

export default function BarberList() {
  const { barbers, isLoading, error, togglePause, deleteBarber } = useBarbers()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-primary rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-gray-600">Carregando barbeiros...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card bg-danger/5 border-danger/20">
        <p className="text-danger text-sm">{error}</p>
      </div>
    )
  }

  if (barbers.length === 0) {
    return (
      <div className="card text-center py-8 sm:py-12">
        <Users className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3" />
        <p className="text-sm sm:text-base text-gray-600">Nenhum barbeiro cadastrado ainda</p>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Clique em "Adicionar Barbeiro" para começar
        </p>
      </div>
    )
  }

  const activeBarbers = barbers.filter((b) => b.isActive)
  const inactiveBarbers = barbers.filter((b) => !b.isActive)

  return (
    <div className="space-y-4 sm:space-y-6">
      {activeBarbers.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
            <h2 className="text-lg sm:text-xl font-semibold">
              Barbeiros Ativos
            </h2>
            <span className="badge-gray">{activeBarbers.length}</span>
          </div>
          <div className="space-y-2 sm:space-y-3">
            {activeBarbers.map((barber) => (
              <BarberCard
                key={barber.id}
                barber={barber}
                onTogglePause={togglePause}
                onDelete={deleteBarber}
              />
            ))}
          </div>
        </div>
      )}

      {inactiveBarbers.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <Pause className="w-4 h-4 sm:w-5 sm:h-5 text-warning" />
            <h2 className="text-lg sm:text-xl font-semibold">
              Barbeiros Pausados
            </h2>
            <span className="badge-warning">{inactiveBarbers.length}</span>
          </div>
          <div className="space-y-2 sm:space-y-3">
            {inactiveBarbers.map((barber) => (
              <BarberCard
                key={barber.id}
                barber={barber}
                onTogglePause={togglePause}
                onDelete={deleteBarber}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
