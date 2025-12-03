'use client'

import { useState, useEffect } from 'react'
import { QueueItem } from '@/types'

export function useQueue(intervalMs: number = 5000) {
  const [queue, setQueue] = useState<QueueItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchQueue = async () => {
    try {
      const response = await fetch('/api/queue/get')
      if (!response.ok) throw new Error('Erro ao buscar fila')
      const data = await response.json()
      setQueue(data.queue)
      setError(null)
    } catch (err) {
      setError('Erro ao carregar fila')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchQueue()
    const interval = setInterval(fetchQueue, intervalMs)
    return () => clearInterval(interval)
  }, [intervalMs])

  const completeAndMoveToEnd = async (
    queueId: string,
    serviceType?: string,
    value?: number,
    notes?: string
  ) => {
    try {
      const response = await fetch('/api/queue/complete-and-next', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ queueId, serviceType, value, notes }),
      })
      if (!response.ok) throw new Error('Erro ao concluir atendimento')
      await fetchQueue()
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }

  const reorderQueue = async (queueId: string, newPosition: number) => {
    try {
      const response = await fetch('/api/queue/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ queueId, newPosition }),
      })
      if (!response.ok) throw new Error('Erro ao reordenar fila')
      await fetchQueue()
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }

  const startAttending = async (queueId: string) => {
    try {
      const response = await fetch('/api/queue/start-attending', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ queueId }),
      })
      if (!response.ok) throw new Error('Erro ao iniciar atendimento')
      await fetchQueue()
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }

  const togglePause = async (queueId: string) => {
    try {
      const response = await fetch('/api/queue/pause', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ queueId }),
      })
      if (!response.ok) throw new Error('Erro ao pausar/despausar')
      await fetchQueue()
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }

  return {
    queue,
    isLoading,
    error,
    refetch: fetchQueue,
    reorderQueue,
    startAttending,
    togglePause,
    completeAndMoveToEnd,
  }
}


