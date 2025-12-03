'use client'

import { useState } from 'react'
import { useQueue } from '@/hooks/useQueue'
import { Play, Check, ArrowUp, ArrowDown, Pause, Clock, CheckCircle, User } from 'lucide-react'
import CompleteAttendanceModal from './CompleteAttendanceModal'

export default function QueueManager() {
  const { queue, isLoading, error, reorderQueue, startAttending } = useQueue()
  const [completingQueue, setCompletingQueue] = useState<string | null>(null)

  const waiting = queue.filter((q) => q.status === 'WAITING')
  const attending = queue.filter((q) => q.status === 'ATTENDING')
  const paused = queue.filter((q) => q.status === 'PAUSED')

  const handleReorder = async (queueId: string, direction: 'up' | 'down') => {
    const currentItem = waiting.find(q => q.id === queueId)
    if (!currentItem) return

    const currentIndex = waiting.indexOf(currentItem)
    if (direction === 'up' && currentIndex > 0) {
      await reorderQueue(queueId, currentItem.position - 1)
    } else if (direction === 'down' && currentIndex < waiting.length - 1) {
      await reorderQueue(queueId, currentItem.position + 1)
    }
  }

  const handleStartAttending = async (queueId: string) => {
    await startAttending(queueId)
  }

  const handleComplete = (item: any) => {
    setCompletingQueue(item.id)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-primary rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-gray-600">Carregando...</p>
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

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Em Atendimento */}
      {attending.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-success" />
            <h2 className="text-lg sm:text-xl font-semibold">Em Atendimento</h2>
            <span className="badge-success">{attending.length}</span>
          </div>
          <div className="space-y-2 sm:space-y-3">
            {attending.map((item) => (
              <div key={item.id} className="card border-success/30 bg-success/5">
                <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-success text-white flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{item.user.name}</h3>
                      <p className="text-xs sm:text-sm text-success-dark">Atendendo agora</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleComplete(item)}
                    className="btn-success btn-sm w-full sm:w-auto flex-shrink-0"
                  >
                    <Check className="w-4 h-4" />
                    Finalizar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Aguardando */}
      {waiting.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
            <h2 className="text-lg sm:text-xl font-semibold">Aguardando</h2>
            <span className="badge-gray">{waiting.length}</span>
          </div>
          <div className="space-y-2 sm:space-y-3">
            {waiting.map((item, index) => (
              <div key={item.id} className="card-hover">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center font-semibold text-sm sm:text-base flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{item.user.name}</h3>
                      <p className="text-xs sm:text-sm text-gray-600">Posição {index + 1}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 justify-end sm:justify-start flex-shrink-0">
                    {index > 0 && (
                      <button
                        onClick={() => handleReorder(item.id, 'up')}
                        className="btn-ghost btn-sm"
                        title="Subir"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                    )}
                    {index < waiting.length - 1 && (
                      <button
                        onClick={() => handleReorder(item.id, 'down')}
                        className="btn-ghost btn-sm"
                        title="Descer"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleStartAttending(item.id)}
                      className="btn-primary btn-sm flex-1 sm:flex-initial"
                    >
                      <Play className="w-4 h-4" />
                      <span className="sm:hidden">Atender</span>
                      <span className="hidden sm:inline">Iniciar</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pausados */}
      {paused.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <Pause className="w-4 h-4 sm:w-5 sm:h-5 text-warning" />
            <h2 className="text-lg sm:text-xl font-semibold">Pausados</h2>
            <span className="badge-warning">{paused.length}</span>
          </div>
          <div className="space-y-2 sm:space-y-3">
            {paused.map((item) => (
              <div key={item.id} className="card bg-gray-50 opacity-70">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center flex-shrink-0">
                    <Pause className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-gray-700 text-sm sm:text-base truncate">{item.user.name}</h3>
                    {item.user.pauseReason && (
                      <p className="text-xs sm:text-sm text-gray-500 truncate">{item.user.pauseReason}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mensagem quando fila vazia */}
      {queue.length === 0 && (
        <div className="card text-center py-8 sm:py-12">
          <Clock className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3" />
          <p className="text-sm sm:text-base text-gray-600">Nenhum barbeiro na fila no momento</p>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Adicione barbeiros em "Barbeiros" para começar
          </p>
        </div>
      )}

      {/* Modal de conclusão */}
      {completingQueue && (
        <CompleteAttendanceModal
          queueId={completingQueue}
          onClose={() => setCompletingQueue(null)}
        />
      )}
    </div>
  )
}
