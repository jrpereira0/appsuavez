'use client'

import { useState, useEffect } from 'react'
import { User } from '@/types'

export function useBarbers() {
  const [barbers, setBarbers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBarbers = async () => {
    try {
      const response = await fetch('/api/barber/list')
      if (!response.ok) throw new Error('Erro ao buscar barbeiros')
      const data = await response.json()
      setBarbers(data.barbers || [])
      setError(null)
    } catch (err) {
      setError('Erro ao carregar barbeiros')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBarbers()
  }, [])

  const createBarber = async (name: string, email: string, password: string) => {
    try {
      const response = await fetch('/api/barber/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erro ao criar barbeiro')
      }
      await fetchBarbers()
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }

  const updateBarber = async (userId: string, name: string, email: string) => {
    try {
      const response = await fetch('/api/barber/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, name, email }),
      })
      if (!response.ok) throw new Error('Erro ao atualizar barbeiro')
      await fetchBarbers()
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }

  const deleteBarber = async (userId: string) => {
    try {
      const response = await fetch(`/api/barber/delete?userId=${userId}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Erro ao deletar barbeiro')
      await fetchBarbers()
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }

  const togglePause = async (userId: string, pauseReason?: string) => {
    try {
      const response = await fetch('/api/barber/toggle-pause', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, pauseReason }),
      })
      if (!response.ok) throw new Error('Erro ao pausar/reativar barbeiro')
      await fetchBarbers()
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }

  return {
    barbers,
    isLoading,
    error,
    refetch: fetchBarbers,
    createBarber,
    updateBarber,
    deleteBarber,
    togglePause,
  }
}


