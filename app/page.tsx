import Link from 'next/link'
import LoginForm from '@/components/LoginForm'

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Sistema de Fila
          </h1>
          <p className="text-gray-600">Gerenciamento de barbearias</p>
        </div>

        <div className="card">
          <LoginForm />
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Não tem uma conta?{' '}
            <Link
              href="/cadastro"
              className="text-primary hover:text-primary-dark font-medium transition-colors"
            >
              Cadastre sua barbearia
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
