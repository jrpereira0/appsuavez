import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user.barbershopId) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const barbershopId = session.user.barbershopId

    const queue = await prisma.queue.findMany({
      where: {
        barbershopId: barbershopId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            isActive: true,
            pauseReason: true,
          },
        },
      },
      orderBy: [
        { position: 'asc' },
      ],
    })

    // Separar por status (ATTENDING first, then WAITING, then PAUSED)
    const attending = queue.filter((q) => q.status === 'ATTENDING')
    const waiting = queue.filter((q) => q.status === 'WAITING')
    const paused = queue.filter((q) => q.status === 'PAUSED')
    
    const sortedQueue = [...attending, ...waiting, ...paused]

    return NextResponse.json({ queue: sortedQueue })
  } catch (error) {
    console.error('Erro ao buscar fila:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar fila' },
      { status: 500 }
    )
  }
}


