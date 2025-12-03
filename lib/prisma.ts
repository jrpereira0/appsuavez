import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Criar client com configurações otimizadas para Neon
const createPrismaClient = () => {
  const client = new PrismaClient({
    log: ['error', 'warn'],
  })

  // Middleware para retry automático em TODAS as queries
  client.$use(async (params, next) => {
    const MAX_RETRIES = 3
    let attempt = 0
    
    while (attempt < MAX_RETRIES) {
      try {
        return await next(params)
      } catch (error: any) {
        attempt++
        
        const isConnectionError = 
          error.code === 'P2024' ||
          error.code === 'P1001' ||
          error.message?.includes('connection') ||
          error.message?.includes('Closed') ||
          error.message?.toLowerCase().includes('timeout')
        
        if (isConnectionError && attempt < MAX_RETRIES) {
          console.log(`🔄 Reconectando... Tentativa ${attempt}/${MAX_RETRIES}`)
          
          try {
            await client.$disconnect()
            await client.$connect()
            console.log('✅ Reconexão bem-sucedida!')
            
            // Aguardar um pouco antes de tentar novamente
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
          } catch (reconnectError) {
            console.error('❌ Erro ao reconectar:', reconnectError)
          }
        } else {
          // Se não é erro de conexão ou esgotou tentativas, lançar o erro
          throw error
        }
      }
    }
    
    throw new Error('Falha após múltiplas tentativas de reconexão')
  })
  
  return client
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Manter compatibilidade com código existente
export const safeQuery = async <T>(operation: () => Promise<T>): Promise<T> => {
  return await operation()
}


