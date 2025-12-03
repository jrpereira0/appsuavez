import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { calculateDuration } from '@/lib/utils'

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== 'OWNER' && session.user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { queueId, serviceType, value, notes } = body

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
        status: 'ATTENDING',
      },
      include: {
        attendance: true,
      },
    })

    if (!queueItem || !queueItem.attendance) {
      return NextResponse.json(
        { error: 'Atendimento não encontrado' },
        { status: 404 }
      )
    }

    const finishedAt = new Date()
    const duration = calculateDuration(queueItem.attendance.startedAt, finishedAt)

    // Atualizar attendance
    await prisma.attendance.update({
      where: { id: queueItem.attendance.id },
      data: {
        finishedAt,
        duration,
        serviceType,
        value: value ? value : null,
        notes,
      },
    })

    // Remover da fila
    await prisma.queue.delete({
      where: { id: queueId },
    })

    // Reordenar posições
    await prisma.$executeRaw`
      UPDATE "Queue"
      SET position = position - 1
      WHERE "barbershopId" = ${session.user.barbershopId}
        AND position > ${queueItem.position}
        AND status IN ('WAITING', 'ATTENDING')
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao concluir atendimento:', error)
    return NextResponse.json(
      { error: 'Erro ao concluir atendimento' },
      { status: 500 }
    )
  }
}


