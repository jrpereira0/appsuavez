'use client'

import { useSession } from 'next-auth/react'
import { useQueue } from '@/hooks/useQueue'
import { useBarbers } from '@/hooks/useBarbers'
import { useAttendanceStats } from '@/hooks/useAttendances'
import Link from 'next/link'
import { Users, Clock, Pause, TrendingUp, DollarSign, BarChart3, ArrowRight } from 'lucide-react'

export default function OwnerDashboard() {
  const { data: session } = useSession()
  const { queue } = useQueue()
  const { barbers } = useBarbers()
  const { stats } = useAttendanceStats()

  const activeBarbers = barbers.filter((b) => b.isActive)
  const pausedBarbers = barbers.filter((b) => !b.isActive)
  const waitingQueue = queue.filter((q) => q.status === 'WAITING')
  const attendingQueue = queue.filter((q) => q.status === 'ATTENDING')

  return (
    <div className="space-y-8">
      <div>
        <h1>Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Bem-vindo, {session?.user?.name}
        </p>
      </div>

      {/* Cards de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card bg-primary/5 border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Aguardando</p>
              <p className="text-3xl font-bold text-gray-900">{waitingQueue.length}</p>
            </div>
            <Clock className="w-10 h-10 text-primary" />
          </div>
        </div>

        <div className="card bg-success/5 border-success/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Em Atendimento</p>
              <p className="text-3xl font-bold text-gray-900">{attendingQueue.length}</p>
            </div>
            <Users className="w-10 h-10 text-success" />
          </div>
        </div>

        <div className="card bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Barbeiros Ativos</p>
              <p className="text-3xl font-bold text-gray-900">{activeBarbers.length}</p>
            </div>
            <Users className="w-10 h-10 text-gray-700" />
          </div>
        </div>

        <div className="card bg-warning/5 border-warning/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pausados</p>
              <p className="text-3xl font-bold text-gray-900">{pausedBarbers.length}</p>
            </div>
            <Pause className="w-10 h-10 text-warning" />
          </div>
        </div>
      </div>

      {/* Estatísticas de atendimento */}
      {stats && stats.totalAttendances > 0 && (
        <div>
          <h2 className="mb-4">Estatísticas de Atendimento</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total de Atendimentos</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalAttendances}</p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-success/10 rounded-lg">
                  <DollarSign className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Valor Total</p>
                  <p className="text-2xl font-bold text-gray-900">
                    R$ {stats.totalValue.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-warning/10 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Duração Média</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.averageDuration} min</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ações rápidas */}
      <div>
        <h2 className="mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/owner/fila"
            className="card-hover group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Gerenciar Fila</h3>
                <p className="text-sm text-gray-600">Organize os atendimentos</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
            </div>
          </Link>

          <Link
            href="/owner/barbeiros"
            className="card-hover group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Barbeiros</h3>
                <p className="text-sm text-gray-600">Gerencie sua equipe</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
            </div>
          </Link>

          <Link
            href="/owner/historico"
            className="card-hover group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Histórico</h3>
                <p className="text-sm text-gray-600">Veja relatórios</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
