'use client'

import { QueueItem as QueueItemType } from '@/types'

interface QueueItemProps {
  item: QueueItemType
  position: number
  isCurrentUser?: boolean
  showActions?: boolean
  onMoveUp?: () => void
  onMoveDown?: () => void
  onRemove?: () => void
  onStartAttending?: () => void
  onComplete?: () => void
}

export default function QueueItem({
  item,
  position,
  isCurrentUser = false,
  showActions = false,
  onMoveUp,
  onMoveDown,
  onRemove,
  onStartAttending,
  onComplete,
}: QueueItemProps) {
  const isAttending = item.status === 'ATTENDING'
  const isPaused = item.status === 'PAUSED'

  return (
    <div
      className={`card flex items-center justify-between ${
        isCurrentUser ? 'ring-2 ring-blue-500 bg-blue-50' : ''
      } ${isPaused ? 'opacity-50' : ''}`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl ${
            isAttending
              ? 'bg-green-500 text-white'
              : isCurrentUser
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          {position}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">
            {item.user.name}
            {isCurrentUser && (
              <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                Você
              </span>
            )}
          </h3>
          <p className="text-sm text-gray-600">
            {isAttending ? (
              <span className="text-green-600 font-medium">Em atendimento</span>
            ) : isPaused ? (
              <span className="text-yellow-600">Pausado</span>
            ) : (
              <span>Aguardando</span>
            )}
          </p>
        </div>
      </div>

      {showActions && (
        <div className="flex gap-2">
          {!isAttending && (
            <>
              {onMoveUp && (
                <button
                  onClick={onMoveUp}
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
                  title="Mover para cima"
                >
                  ↑
                </button>
              )}
              {onMoveDown && (
                <button
                  onClick={onMoveDown}
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
                  title="Mover para baixo"
                >
                  ↓
                </button>
              )}
            </>
          )}
          
          {!isAttending && onStartAttending && (
            <button
              onClick={onStartAttending}
              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
            >
              Iniciar
            </button>
          )}
          
          {isAttending && onComplete && (
            <button
              onClick={onComplete}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
            >
              Concluir
            </button>
          )}
          
          {onRemove && (
            <button
              onClick={onRemove}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
            >
              Remover
            </button>
          )}
        </div>
      )}
    </div>
  )
}


