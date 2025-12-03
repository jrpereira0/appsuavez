import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== 'OWNER' && session.user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const barbershopId = session.user.barbershopId

    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'ID do barbeiro é obrigatório' },
        { status: 400 }
      )
    }

    // Verificar se o barbeiro pertence à mesma barbearia
    const barber = await prisma.user.findFirst({
      where: {
        id: userId,
        barbershopId: barbershopId,
        role: 'BARBER',
      },
    })

    if (!barber) {
      return NextResponse.json(
        { error: 'Barbeiro não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se já está na fila
    const existingQueue = await prisma.queue.findFirst({
      where: {
        userId,
        barbershopId: barbershopId,
        status: {
          in: ['WAITING', 'ATTENDING'],
        },
      },
    })

    if (existingQueue) {
      return NextResponse.json(
        { error: 'Barbeiro já está na fila' },
        { status: 400 }
      )
    }

    // Buscar última posição
    const lastQueue = await prisma.queue.findFirst({
      where: {
        barbershopId: barbershopId,
        status: {
          in: ['WAITING', 'ATTENDING'],
        },
      },
      orderBy: {
        position: 'desc',
      },
    })

    const newPosition = (lastQueue?.position || 0) + 1

    const queueItem = await prisma.queue.create({
      data: {
        position: newPosition,
        userId,
        barbershopId: barbershopId!,
        status: 'WAITING',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            isActive: true,
          },
        },
      },
    })

    return NextResponse.json({ success: true, queueItem })
  } catch (error) {
    console.error('Erro ao adicionar à fila:', error)
    return NextResponse.json(
      { error: 'Erro ao adicionar à fila' },
      { status: 500 }
    )
  }
}


