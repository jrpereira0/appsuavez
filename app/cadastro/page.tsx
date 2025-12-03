import Link from 'next/link'
import RegisterBarbershopForm from '@/components/RegisterBarbershopForm'
import { ArrowLeft } from 'lucide-react'

export default function CadastroPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para login
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Cadastrar Barbearia
          </h1>
          <p className="text-gray-600">Crie sua conta e comece a gerenciar sua fila</p>
        </div>

        <div className="card">
          <RegisterBarbershopForm />
        </div>
      </div>
    </main>
  )
}
