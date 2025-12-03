'use client'

import { useAttendances } from '@/hooks/useAttendances'
import { formatDateTime, formatCurrency } from '@/lib/utils'
import { Clock, DollarSign, FileText } from 'lucide-react'

interface AttendanceListProps {
  userId?: string
  limit?: number
  startDate?: Date | null
  endDate?: Date | null
}

export default function AttendanceList({ userId, limit, startDate, endDate }: AttendanceListProps) {
  const { attendances, isLoading, error } = useAttendances(userId, limit, startDate, endDate)

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

  if (attendances.length === 0) {
    return (
      <div className="card text-center py-12">
        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-600">Nenhum atendimento registrado ainda</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {attendances.map((attendance) => (
        <div key={attendance.id} className="card-hover">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-gray-900">
                  {attendance.user.name}
                </h3>
                {attendance.serviceType && (
                  <span className="badge-gray">{attendance.serviceType}</span>
                )}
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>{formatDateTime(attendance.startedAt)}</span>
                {attendance.duration && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{attendance.duration} min</span>
                  </div>
                )}
              </div>
              {attendance.notes && (
                <p className="text-sm text-gray-600 mt-2 italic">
                  {attendance.notes}
                </p>
              )}
            </div>
            {attendance.value && (
              <div className="flex items-center gap-1.5 text-success-dark font-semibold">
                <DollarSign className="w-4 h-4" />
                <span>{formatCurrency(parseFloat(attendance.value.toString()))}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
