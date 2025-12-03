'use client'

import { useState, useEffect } from 'react'
import { Attendance, AttendanceStats } from '@/types'

export function useAttendances(
  userId?: string,
  limit: number = 50,
  startDate?: Date | null,
  endDate?: Date | null
) {
  const [attendances, setAttendances] = useState<Attendance[]>([])
  const [stats, setStats] = useState<AttendanceStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setIsLoading(true)
      
      // Buscar lista de atendimentos
      const listParams = new URLSearchParams()
      if (userId) listParams.append('userId', userId)
      listParams.append('limit', limit.toString())
      if (startDate) listParams.append('startDate', startDate.toISOString())
      if (endDate) listParams.append('endDate', endDate.toISOString())

      const listResponse = await fetch(`/api/attendance/list?${listParams.toString()}`)
      if (!listResponse.ok) throw new Error('Erro ao buscar atendimentos')
      const listData = await listResponse.json()
      setAttendances(listData.attendances)

      // Buscar estatísticas
      const statsParams = new URLSearchParams()
      if (userId) statsParams.append('userId', userId)
      if (startDate) statsParams.append('startDate', startDate.toISOString())
      if (endDate) statsParams.append('endDate', endDate.toISOString())
      const statsQuery = statsParams.toString() ? `?${statsParams.toString()}` : ''
      const statsResponse = await fetch(`/api/attendance/stats${statsQuery}`)
      if (!statsResponse.ok) throw new Error('Erro ao buscar estatísticas')
      const statsData = await statsResponse.json()
      setStats(statsData)

      setError(null)
    } catch (err) {
      setError('Erro ao carregar dados')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [userId, limit, startDate, endDate])

  const completeAttendance = async (
    queueId: string,
    serviceType?: string,
    value?: number,
    notes?: string
  ) => {
    try {
      const response = await fetch('/api/attendance/complete', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ queueId, serviceType, value, notes }),
      })
      if (!response.ok) throw new Error('Erro ao concluir atendimento')
      await fetchData()
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }

  return {
    attendances,
    stats,
    isLoading,
    error,
    refetch: fetchData,
    completeAttendance,
  }
}

export function useAttendanceStats(
  userId?: string,
  startDate?: Date | null,
  endDate?: Date | null
) {
  const [stats, setStats] = useState<AttendanceStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const params = new URLSearchParams()
        if (userId) params.append('userId', userId)
        if (startDate) params.append('startDate', startDate.toISOString())
        if (endDate) params.append('endDate', endDate.toISOString())
        const query = params.toString() ? `?${params.toString()}` : ''
        const response = await fetch(`/api/attendance/stats${query}`)
        if (!response.ok) throw new Error('Erro ao buscar estatísticas')
        const data = await response.json()
        setStats(data)
        setError(null)
      } catch (err) {
        setError('Erro ao carregar estatísticas')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [userId, startDate, endDate])

  return { stats, isLoading, error }
}
