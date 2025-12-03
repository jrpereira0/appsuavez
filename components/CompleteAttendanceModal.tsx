'use client'

import { useState } from 'react'
import { useQueue } from '@/hooks/useQueue'
import { X } from 'lucide-react'

interface CompleteAttendanceModalProps {
  queueId: string
  onClose: () => void
}

export default function CompleteAttendanceModal({
  queueId,
  onClose,
}: CompleteAttendanceModalProps) {
  const { completeAndMoveToEnd } = useQueue()
  const [formData, setFormData] = useState({
    serviceType: '',
    value: '',
    notes: '',
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const result = await completeAndMoveToEnd(
      queueId,
      formData.serviceType || undefined,
      formData.value ? parseFloat(formData.value) : undefined,
      formData.notes || undefined
    )

    setIsLoading(false)

    if (result.success) {
      onClose()
    } else {
      alert(result.error)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-lg w-full max-w-md shadow-lg animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Concluir Atendimento</h2>
          <button
            onClick={onClose}
            className="btn-ghost p-2 -mr-2"
            disabled={isLoading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="serviceType" className="label">
              Tipo de Serviço
            </label>
            <input
              id="serviceType"
              name="serviceType"
              type="text"
              value={formData.serviceType}
              onChange={handleChange}
              className="input-field"
              placeholder="Ex: Corte, Barba, Completo"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="value" className="label">
              Valor (R$)
            </label>
            <input
              id="value"
              name="value"
              type="number"
              step="0.01"
              min="0"
              value={formData.value}
              onChange={handleChange}
              className="input-field"
              placeholder="0.00"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="notes" className="label">
              Observações
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="input-field min-h-[80px]"
              rows={3}
              placeholder="Observações sobre o atendimento..."
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="btn-primary flex-1"
              disabled={isLoading}
            >
              {isLoading ? 'Salvando...' : 'Concluir Atendimento'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={isLoading}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
