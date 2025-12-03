'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Store } from 'lucide-react'

export default function RegisterBarbershopForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    barbershopName: '',
    ownerName: '',
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/barbershop/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao cadastrar barbearia')
      }

      // Fazer login automaticamente
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        setError('Barbearia criada, mas erro ao fazer login')
        setIsLoading(false)
        return
      }

      router.push('/owner')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Erro ao cadastrar barbearia')
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="barbershopName" className="label">
          Nome da Barbearia
        </label>
        <input
          id="barbershopName"
          name="barbershopName"
          type="text"
          value={formData.barbershopName}
          onChange={handleChange}
          className="input-field"
          required
          disabled={isLoading}
          minLength={3}
          placeholder="Barbearia Exemplo"
        />
      </div>

      <div>
        <label htmlFor="ownerName" className="label">
          Seu Nome
        </label>
        <input
          id="ownerName"
          name="ownerName"
          type="text"
          value={formData.ownerName}
          onChange={handleChange}
          className="input-field"
          required
          disabled={isLoading}
          minLength={3}
          placeholder="João Silva"
        />
      </div>

      <div>
        <label htmlFor="email" className="label">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className="input-field"
          required
          disabled={isLoading}
          placeholder="seu@email.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="label">
          Senha
        </label>
        <input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          className="input-field"
          required
          disabled={isLoading}
          minLength={6}
          placeholder="Mínimo 6 caracteres"
        />
      </div>

      {error && (
        <div className="bg-danger/10 border border-danger/20 text-danger px-4 py-3 rounded text-sm">
          {error}
        </div>
      )}

      <button type="submit" className="btn-primary w-full" disabled={isLoading}>
        <Store className="w-4 h-4" />
        {isLoading ? 'Cadastrando...' : 'Cadastrar Barbearia'}
      </button>
    </form>
  )
}
