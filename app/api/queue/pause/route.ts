import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== 'OWNER' && session.user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { queueId } = body

    if (!queueId) {
      return NextResponse.json(
        { error: 'ID da fila é obrigatório' },
        { status: 400 }
      )
    }

    const queueItem = await prisma.queue.findFirst({
      where: {
        id: queueId,
        barbershopId: session.user.barbershopId,
      },
    })

    if (!queueItem) {
      return NextResponse.json(
        { error: 'Item da fila não encontrado' },
        { status: 404 }
      )
    }

    const newStatus = queueItem.status === 'PAUSED' ? 'WAITING' : 'PAUSED'

    await prisma.queue.update({
      where: { id: queueId },
      data: { status: newStatus },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao pausar/despausar fila:', error)
    return NextResponse.json(
      { error: 'Erro ao pausar/despausar fila' },
      { status: 500 }
    )
  }
}


