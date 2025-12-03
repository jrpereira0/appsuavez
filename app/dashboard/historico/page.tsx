'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useAttendances } from '@/hooks/useAttendances'
import DateRangeFilter from '@/components/DateRangeFilter'
import { BarChart3, Clock, Scissors, Calendar } from 'lucide-react'
import { formatDateTime, formatDuration } from '@/lib/utils'

export default function HistoricoBarberPage() {
  const { data: session } = useSession()
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  
  const { attendances, stats, isLoading, error } = useAttendances(
    session?.user?.id,
    50,
    startDate,
    endDate
  )

  const handleClearFilters = () => {
    setStartDate(null)
    setEndDate(null)
  }

  // Contagem para mostrar no filtro
  const resultsCount = attendances.length

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-primary rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-gray-600">Carregando histórico...</p>
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
      {/* Cabeçalho */}
      <div>
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
          <h1>Meu Histórico</h1>
        </div>
        <p className="text-sm sm:text-base text-gray-600">
          Acompanhe suas estatísticas e atendimentos realizados
        </p>
      </div>

      <DateRangeFilter
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onClear={handleClearFilters}
        resultsCount={resultsCount}
      />

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {/* Total de Atendimentos */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Total de Atendimentos</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                {stats?.totalAttendances || 0}
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Scissors className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
          </div>
        </div>

        {/* Duração Média */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Duração Média</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                {stats?.averageDuration ? formatDuration(stats.averageDuration) : '0min'}
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-success" />
            </div>
          </div>
        </div>
      </div>

      {/* Atendimentos por Tipo */}
      {stats?.byServiceType && Object.keys(stats.byServiceType).length > 0 && (
        <div className="card">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Atendimentos por Tipo</h2>
          <div className="space-y-2 sm:space-y-3">
            {Object.entries(stats.byServiceType).map(([type, data]: [string, any]) => (
              <div key={type} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Scissors className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-gray-900 text-sm sm:text-base truncate">{type}</h3>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {data.count} atendimento{data.count !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lista de Atendimentos */}
      <div className="card">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="text-lg sm:text-xl font-semibold">Últimos Atendimentos</h2>
          <span className="badge-gray">{attendances.length}</span>
        </div>

        {attendances.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <Calendar className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3" />
            <p className="text-sm sm:text-base text-gray-600">Nenhum atendimento realizado ainda</p>
          </div>
        ) : (
          <div className="space-y-2 sm:space-y-3">
            {attendances.map((attendance) => (
              <div key={attendance.id} className="p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Scissors className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <h3 className="font-medium text-gray-900 text-sm sm:text-base truncate">
                        {attendance.serviceType}
                      </h3>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formatDateTime(attendance.startedAt)}</span>
                      </div>
                      {attendance.duration && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{formatDuration(attendance.duration)}</span>
                        </div>
                      )}
                    </div>
                    {attendance.notes && (
                      <p className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-2">
                        {attendance.notes}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
