'use client'

import { useState } from 'react'
import BarberList from '@/components/BarberList'
import CreateBarberForm from '@/components/CreateBarberForm'
import { Users, Plus, X } from 'lucide-react'

export default function BarbeirosPage() {
  const [showForm, setShowForm] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleBarberCreated = () => {
    setShowForm(false)
    setRefreshKey(prev => prev + 1) // Força o BarberList a recarregar
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <Users className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            <h1>Barbeiros</h1>
          </div>
          <p className="text-sm sm:text-base text-gray-600">
            Gerencie a equipe da sua barbearia
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`${showForm ? 'btn-secondary' : 'btn-primary'} w-full sm:w-auto flex-shrink-0`}
        >
          {showForm ? (
            <>
              <X className="w-4 h-4" />
              Cancelar
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Adicionar Barbeiro</span>
              <span className="sm:hidden">Adicionar</span>
            </>
          )}
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h2 className="mb-4">Novo Barbeiro</h2>
          <CreateBarberForm
            onSuccess={handleBarberCreated}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      <BarberList key={refreshKey} />
    </div>
  )
}
