import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== 'OWNER' && session.user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const barbershopId = session.user.barbershopId!

    const { searchParams } = new URL(request.url)
    const queueId = searchParams.get('queueId')

    if (!queueId) {
      return NextResponse.json(
        { error: 'ID da fila é obrigatório' },
        { status: 400 }
      )
    }

    // Verificar se pertence à mesma barbearia
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

    await prisma.queue.delete({
      where: { id: queueId },
    })

    // Reordenar posições
    await prisma.$executeRaw`
      UPDATE "Queue"
      SET position = position - 1
      WHERE "barbershopId" = ${barbershopId}
        AND position > ${queueItem.position}
        AND status IN ('WAITING', 'ATTENDING')
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao remover da fila:', error)
    return NextResponse.json(
      { error: 'Erro ao remover da fila' },
      { status: 500 }
    )
  }
}


