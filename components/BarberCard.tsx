'use client'

import { useState } from 'react'
import { User as UserType } from '@/types'
import { formatDateTime } from '@/lib/utils'
import { Pause, Play, Trash2, User, X } from 'lucide-react'

interface BarberCardProps {
  barber: UserType
  onTogglePause: (userId: string, pauseReason?: string) => Promise<void>
  onDelete: (userId: string) => Promise<void>
}

export default function BarberCard({ barber, onTogglePause, onDelete }: BarberCardProps) {
  const [showPauseModal, setShowPauseModal] = useState(false)
  const [pauseReason, setPauseReason] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleTogglePause = async () => {
    if (barber.isActive) {
      setShowPauseModal(true)
    } else {
      setIsLoading(true)
      await onTogglePause(barber.id)
      setIsLoading(false)
    }
  }

  const handleConfirmPause = async () => {
    setIsLoading(true)
    await onTogglePause(barber.id, pauseReason || undefined)
    setShowPauseModal(false)
    setPauseReason('')
    setIsLoading(false)
  }

  const handleDelete = async () => {
    if (confirm(`Tem certeza que deseja remover ${barber.name}?`)) {
      await onDelete(barber.id)
    }
  }

  return (
    <>
      <div className={`card ${!barber.isActive ? 'bg-gray-50 opacity-70' : ''}`}>
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div
              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                barber.isActive ? 'bg-primary/10' : 'bg-gray-200'
              }`}
            >
              <User className={`w-5 h-5 sm:w-6 sm:h-6 ${barber.isActive ? 'text-primary' : 'text-gray-500'}`} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{barber.name}</h3>
                {!barber.isActive && (
                  <span className="badge-warning flex-shrink-0">Pausado</span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-gray-600 truncate">{barber.email}</p>
              
              {!barber.isActive && barber.pauseReason && (
                <p className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-1">
                  {barber.pauseReason}
                </p>
              )}
              
              {!barber.isActive && barber.pausedAt && (
                <p className="text-xs text-gray-400 mt-1 hidden sm:block">
                  Pausado em: {formatDateTime(barber.pausedAt)}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex gap-2 justify-end sm:justify-start flex-shrink-0">
            <button
              onClick={handleTogglePause}
              disabled={isLoading}
              className={`${barber.isActive ? 'btn-secondary' : 'btn-success'} btn-sm flex-1 sm:flex-initial`}
            >
              {barber.isActive ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span className="hidden sm:inline">Pausar</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span className="hidden sm:inline">Reativar</span>
                </>
              )}
            </button>
            <button
              onClick={handleDelete}
              disabled={isLoading}
              className="btn-danger btn-sm"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal para pausar */}
      {showPauseModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Pausar Barbeiro</h3>
              <button
                onClick={() => setShowPauseModal(false)}
                className="text-gray-400 hover:text-gray-600"
                disabled={isLoading}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Pausar <strong>{barber.name}</strong>
            </p>

            <div className="mb-4">
              <label className="label">Motivo (opcional)</label>
              <input
                type="text"
                value={pauseReason}
                onChange={(e) => setPauseReason(e.target.value)}
                className="input-field"
                placeholder="Ex: Almoço, Atendimento externo..."
                disabled={isLoading}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowPauseModal(false)}
                className="btn-secondary flex-1"
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmPause}
                className="btn-primary flex-1"
                disabled={isLoading}
              >
                {isLoading ? 'Pausando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
