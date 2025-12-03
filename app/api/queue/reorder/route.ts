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
    const { queueId, newPosition } = body

    if (!queueId || typeof newPosition !== 'number') {
      return NextResponse.json(
        { error: 'Dados inválidos' },
        { status: 400 }
      )
    }

    const queueItem = await prisma.queue.findFirst({
      where: {
        id: queueId,
        barbershopId: session.user.barbershopId,
        status: 'WAITING', // Só pode reordenar quem está aguardando
      },
    })

    if (!queueItem) {
      return NextResponse.json(
        { error: 'Item da fila não encontrado ou não pode ser reordenado' },
        { status: 404 }
      )
    }

    const oldPosition = queueItem.position

    if (oldPosition === newPosition) {
      return NextResponse.json({ success: true })
    }

    // Reordenar apenas dentro de WAITING
    await prisma.$transaction(async (tx) => {
      if (oldPosition < newPosition) {
        // Movendo para baixo
        await tx.$executeRaw`
          UPDATE "Queue"
          SET position = position - 1
          WHERE "barbershopId" = ${session.user.barbershopId}
            AND position > ${oldPosition}
            AND position <= ${newPosition}
            AND status = 'WAITING'
        `
      } else {
        // Movendo para cima
        await tx.$executeRaw`
          UPDATE "Queue"
          SET position = position + 1
          WHERE "barbershopId" = ${session.user.barbershopId}
            AND position >= ${newPosition}
            AND position < ${oldPosition}
            AND status = 'WAITING'
        `
      }

      await tx.queue.update({
        where: { id: queueId },
        data: { position: newPosition },
      })
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao reordenar fila:', error)
    return NextResponse.json(
      { error: 'Erro ao reordenar fila' },
      { status: 500 }
    )
  }
}


