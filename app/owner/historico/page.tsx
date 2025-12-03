'use client'

import { useState } from 'react'
import { useAttendances } from '@/hooks/useAttendances'
import AttendanceList from '@/components/AttendanceList'
import AttendanceStats from '@/components/AttendanceStats'
import DateRangeFilter from '@/components/DateRangeFilter'
import { BarChart3 } from 'lucide-react'

export default function HistoricoPage() {
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  
  // Buscar contagem para o filtro
  const { attendances } = useAttendances(undefined, 1000, startDate, endDate)

  const handleClearFilters = () => {
    setStartDate(null)
    setEndDate(null)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
          <h1>Histórico de Atendimentos</h1>
        </div>
        <p className="text-sm sm:text-base text-gray-600">
          Visualize estatísticas e histórico completo de atendimentos
        </p>
      </div>

      <DateRangeFilter
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onClear={handleClearFilters}
        resultsCount={attendances.length}
      />

      <AttendanceStats startDate={startDate} endDate={endDate} />

      <div className="card">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Todos os Atendimentos</h2>
        <AttendanceList limit={100} startDate={startDate} endDate={endDate} />
      </div>
    </div>
  )
}
