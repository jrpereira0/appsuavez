'use client'

import { useSession } from 'next-auth/react'
import { useQueue } from '@/hooks/useQueue'
import { Clock, User, CheckCircle, Pause } from 'lucide-react'

export default function BarberDashboard() {
  const { data: session } = useSession()
  const { queue, isLoading, error } = useQueue()

  const attending = queue.filter((q) => q.status === 'ATTENDING')
  const waiting = queue.filter((q) => q.status === 'WAITING')
  const paused = queue.filter((q) => q.status === 'PAUSED')

  // Encontrar posição do barbeiro atual
  const myPosition = waiting.findIndex((q) => q.user.id === session?.user?.id)
  const peopleAhead = myPosition > -1 ? myPosition : null

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-primary rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-gray-600">Carregando fila...</p>
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

  const isMyTurn = myPosition === 0
  const amIAttending = attending.some((q) => q.user.id === session?.user?.id)
  const amIPaused = paused.some((q) => q.user.id === session?.user?.id)

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Cabeçalho */}
      <div>
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
          <h1>Fila de Atendimento</h1>
        </div>
        <p className="text-sm sm:text-base text-gray-600">
          Acompanhe sua posição na fila em tempo real
        </p>
      </div>

      {/* Status do barbeiro */}
      {amIAttending && (
        <div className="card border-success/30 bg-success/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-success text-white flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-success-dark text-sm sm:text-base">Você está atendendo!</h3>
              <p className="text-xs sm:text-sm text-gray-600">Finalize quando concluir o atendimento</p>
            </div>
          </div>
        </div>
      )}

      {amIPaused && (
        <div className="card border-warning/30 bg-warning/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-warning text-white flex items-center justify-center flex-shrink-0">
              <Pause className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-warning-dark text-sm sm:text-base">Você está pausado</h3>
              <p className="text-xs sm:text-sm text-gray-600">Entre em contato com o administrador</p>
            </div>
          </div>
        </div>
      )}

      {!amIAttending && !amIPaused && peopleAhead !== null && (
        <div className={`card ${isMyTurn ? 'border-primary/30 bg-primary/5' : ''}`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-semibold flex-shrink-0 ${
              isMyTurn ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'
            }`}>
              {myPosition + 1}
            </div>
            <div>
              <h3 className={`font-semibold text-sm sm:text-base ${isMyTurn ? 'text-primary' : 'text-gray-900'}`}>
                {isMyTurn ? 'É a sua vez!' : `Sua posição: ${myPosition + 1}º`}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600">
                {isMyTurn
                  ? 'Aguarde o administrador iniciar seu atendimento'
                  : `${peopleAhead} pessoa${peopleAhead !== 1 ? 's' : ''} na sua frente`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Em Atendimento */}
      {attending.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-success" />
            <h2 className="text-lg sm:text-xl font-semibold">Em Atendimento</h2>
            <span className="badge-success">{attending.length}</span>
          </div>
          <div className="space-y-2 sm:space-y-3">
            {attending.map((item) => {
              const isMe = item.user.id === session?.user?.id
              return (
                <div
                  key={item.id}
                  className={`card ${isMe ? 'border-success/50 bg-success/10' : 'border-success/30 bg-success/5'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-success text-white flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                        {item.user.name}
                        {isMe && <span className="text-primary ml-2">(Você)</span>}
                      </h3>
                      <p className="text-xs sm:text-sm text-success-dark">Atendendo agora</p>
                    </div>
                  </div>
                </div>
              )
            })}
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
            {waiting.map((item, index) => {
              const isMe = item.user.id === session?.user?.id
              return (
                <div
                  key={item.id}
                  className={`card ${isMe ? 'border-primary/50 bg-primary/10' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm sm:text-base flex-shrink-0 ${
                      isMe ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className={`font-semibold text-sm sm:text-base truncate ${isMe ? 'text-primary' : 'text-gray-900'}`}>
                        {item.user.name}
                        {isMe && <span className="ml-2">(Você)</span>}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600">Posição {index + 1}</p>
                    </div>
                  </div>
                </div>
              )
            })}
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
            {paused.map((item) => {
              const isMe = item.user.id === session?.user?.id
              return (
                <div
                  key={item.id}
                  className={`card bg-gray-50 ${isMe ? 'border-warning/50' : 'opacity-70'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center flex-shrink-0">
                      <Pause className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-gray-700 text-sm sm:text-base truncate">
                        {item.user.name}
                        {isMe && <span className="text-warning ml-2">(Você)</span>}
                      </h3>
                      {item.user.pauseReason && (
                        <p className="text-xs sm:text-sm text-gray-500 truncate">{item.user.pauseReason}</p>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {queue.length === 0 && (
        <div className="card text-center py-8 sm:py-12">
          <Clock className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3" />
          <p className="text-sm sm:text-base text-gray-600">Fila vazia no momento</p>
        </div>
      )}
    </div>
  )
}
