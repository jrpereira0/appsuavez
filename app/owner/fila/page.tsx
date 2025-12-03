'use client'

import QueueManager from '@/components/QueueManager'
import { ListOrdered } from 'lucide-react'

export default function FilaPage() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <ListOrdered className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
          <h1>Gestão da Fila</h1>
        </div>
        <p className="text-sm sm:text-base text-gray-600">
          Organize a ordem de atendimento dos barbeiros
        </p>
      </div>

      <QueueManager />
    </div>
  )
}
