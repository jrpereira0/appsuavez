'use client'

import { useAttendanceStats } from '@/hooks/useAttendances'
import { formatCurrency } from '@/lib/utils'
import { BarChart3, DollarSign, TrendingUp, FileText } from 'lucide-react'

interface AttendanceStatsProps {
  userId?: string
  startDate?: Date | null
  endDate?: Date | null
}

export default function AttendanceStats({ userId, startDate, endDate }: AttendanceStatsProps) {
  const { stats, isLoading, error } = useAttendanceStats(userId, startDate, endDate)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="w-6 h-6 border-4 border-gray-200 border-t-primary rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-xs text-gray-600">Carregando estatísticas...</p>
        </div>
      </div>
    )
  }

  if (error || !stats || stats.totalAttendances === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-primary/5 border-primary/20">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-lg">
              <BarChart3 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-0.5">Total de Atendimentos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalAttendances}</p>
            </div>
          </div>
        </div>

        <div className="card bg-success/5 border-success/20">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-success/10 rounded-lg">
              <DollarSign className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-0.5">Valor Total</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats.totalValue)}
              </p>
            </div>
          </div>
        </div>

        <div className="card bg-warning/5 border-warning/20">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-warning/10 rounded-lg">
              <TrendingUp className="w-6 h-6 text-warning" />
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-0.5">Duração Média</p>
              <p className="text-2xl font-bold text-gray-900">{stats.averageDuration} min</p>
            </div>
          </div>
        </div>
      </div>

      {stats.byServiceType.length > 0 && (
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-gray-700" />
            <h3 className="text-lg font-semibold">Por Tipo de Serviço</h3>
          </div>
          <div className="space-y-3">
            {stats.byServiceType.map((item) => (
              <div key={item.serviceType} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-medium text-gray-900">{item.serviceType}</p>
                  <p className="text-xs text-gray-500">{item.count} atendimento(s)</p>
                </div>
                <p className="text-sm font-semibold text-success-dark">
                  {formatCurrency(item.totalValue)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
