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

    const barbershopId = session.user.barbershopId!

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
        barbershopId: barbershopId,
      },
    })

    if (!queueItem) {
      return NextResponse.json(
        { error: 'Item da fila não encontrado' },
        { status: 404 }
      )
    }

    // Criar attendance e atualizar queue
    const attendance = await prisma.attendance.create({
      data: {
        userId: queueItem.userId,
        barbershopId: barbershopId!,
        startedAt: new Date(),
      },
    })

    await prisma.queue.update({
      where: { id: queueId },
      data: {
        status: 'ATTENDING',
        attendanceId: attendance.id,
      },
    })

    return NextResponse.json({ success: true, attendance })
  } catch (error) {
    console.error('Erro ao iniciar atendimento:', error)
    return NextResponse.json(
      { error: 'Erro ao iniciar atendimento' },
      { status: 500 }
    )
  }
}


