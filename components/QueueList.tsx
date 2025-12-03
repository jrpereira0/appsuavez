'use client'

import { useQueue } from '@/hooks/useQueue'
import { useSession } from 'next-auth/react'
import { Clock, User, Pause, CheckCircle } from 'lucide-react'

export default function QueueList() {
  const { queue, isLoading, error } = useQueue()
  const { data: session } = useSession()

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

  const attending = queue.filter((q) => q.status === 'ATTENDING')
  const waiting = queue.filter((q) => q.status === 'WAITING')
  const paused = queue.filter((q) => q.status === 'PAUSED')

  const userInWaiting = waiting.findIndex((item) => item.userId === session?.user?.id)
  const userInAttending = attending.findIndex((item) => item.userId === session?.user?.id)
  const peopleAhead = userInWaiting > 0 ? userInWaiting : 0

  if (queue.length === 0) {
    return (
      <div className="card text-center py-12">
        <p className="text-gray-500">Nenhum barbeiro na fila no momento</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Status do usuário */}
      {userInAttending >= 0 && (
        <div className="card bg-success/10 border-success/30">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-success" />
            <div>
              <p className="font-semibold text-gray-900">Você está em atendimento!</p>
              <p className="text-sm text-gray-600">Aguarde a conclusão do seu atendimento</p>
            </div>
          </div>
        </div>
      )}

      {userInWaiting >= 0 && (
        <div className="card bg-primary/10 border-primary/30">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-primary" />
            <div>
              <p className="font-semibold text-gray-900">
                Sua posição: {userInWaiting + 1}º na fila de espera
              </p>
              {peopleAhead > 0 && (
                <p className="text-sm text-gray-600">
                  {peopleAhead} {peopleAhead === 1 ? 'pessoa' : 'pessoas'} na sua frente
                </p>
              )}
              {peopleAhead === 0 && (
                <p className="text-sm text-success-dark font-medium">
                  Você é o próximo! Prepare-se.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Em Atendimento */}
      {attending.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-success" />
            <h3 className="text-lg font-semibold">Em Atendimento</h3>
            <span className="badge-success">{attending.length}</span>
          </div>
          <div className="space-y-2">
            {attending.map((item) => {
              const isCurrentUser = item.userId === session?.user?.id
              return (
                <div
                  key={item.id}
                  className={`card border-success/30 ${
                    isCurrentUser ? 'bg-success/10 ring-2 ring-success/50' : 'bg-success/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-success text-white flex items-center justify-center">
                      <User className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">
                        {item.user.name}
                        {isCurrentUser && (
                          <span className="ml-2 badge-primary text-xs">Você</span>
                        )}
                      </h4>
                      <p className="text-sm text-success-dark">Atendendo agora</p>
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
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-gray-700" />
            <h3 className="text-lg font-semibold">Aguardando</h3>
            <span className="badge-gray">{waiting.length}</span>
          </div>
          <div className="space-y-2">
            {waiting.map((item, index) => {
              const isCurrentUser = item.userId === session?.user?.id
              return (
                <div
                  key={item.id}
                  className={`card ${
                    isCurrentUser ? 'bg-primary/10 border-primary ring-2 ring-primary/50' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${
                        isCurrentUser
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {item.user.name}
                        {isCurrentUser && (
                          <span className="ml-2 badge-primary text-xs">Você</span>
                        )}
                      </h4>
                      <p className="text-xs text-gray-500">Posição {index + 1}</p>
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
          <div className="flex items-center gap-2 mb-4">
            <Pause className="w-5 h-5 text-warning" />
            <h3 className="text-lg font-semibold">Pausados</h3>
            <span className="badge-warning">{paused.length}</span>
          </div>
          <div className="space-y-2">
            {paused.map((item) => {
              const isCurrentUser = item.userId === session?.user?.id
              return (
                <div
                  key={item.id}
                  className={`card bg-gray-50 opacity-70 ${
                    isCurrentUser ? 'ring-2 ring-warning/50' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center">
                      <Pause className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-700">
                        {item.user.name}
                        {isCurrentUser && (
                          <span className="ml-2 badge-warning text-xs">Você</span>
                        )}
                      </h4>
                      {item.user.pauseReason && (
                        <p className="text-xs text-gray-500">{item.user.pauseReason}</p>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
