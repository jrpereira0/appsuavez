import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma, safeQuery } from '@/lib/prisma'

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== 'OWNER' && session.user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const barbershopId = session.user.barbershopId!

    const body = await request.json()
    const { userId, pauseReason } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'ID do barbeiro é obrigatório' },
        { status: 400 }
      )
    }

    // Usar safeQuery para garantir reconexão automática
    const updatedBarber = await safeQuery(async () => {
      // Verificar se o barbeiro pertence à mesma barbearia
      const barber = await prisma.user.findFirst({
        where: {
          id: userId,
          barbershopId: barbershopId,
        },
      })

      if (!barber) {
        throw new Error('Barbeiro não encontrado')
      }

      // Atualizar barbeiro e status na fila
      return await prisma.$transaction(async (tx) => {
        const updated = await tx.user.update({
          where: { id: userId },
          data: {
            isActive: !barber.isActive,
            pauseReason: !barber.isActive ? null : pauseReason,
            pausedAt: !barber.isActive ? null : new Date(),
          },
          select: {
            id: true,
            name: true,
            isActive: true,
            pauseReason: true,
            pausedAt: true,
          },
        })

        // Pegar a fila atual antes de modificar
        const currentQueue = await tx.queue.findFirst({
          where: {
            userId: userId,
            barbershopId: barbershopId,
          },
        })

        if (currentQueue) {
          if (updated.isActive) {
            // REATIVANDO: Mover para o FINAL da fila
            // Pegar a maior posição atual
            const maxPosition = await tx.queue.findFirst({
              where: {
                barbershopId: barbershopId,
                status: { in: ['WAITING', 'ATTENDING'] },
              },
              orderBy: { position: 'desc' },
            })

            await tx.queue.update({
              where: { id: currentQueue.id },
              data: {
                status: 'WAITING',
                position: (maxPosition?.position || 0) + 1,
              },
            })
          } else {
            // PAUSANDO: Marcar como PAUSED e ajustar posições dos outros
            const currentPosition = currentQueue.position

            // Marcar como pausado
            await tx.queue.update({
              where: { id: currentQueue.id },
              data: {
                status: 'PAUSED',
              },
            })

            // Subir todos que estavam depois dele
            await tx.queue.updateMany({
              where: {
                barbershopId: barbershopId,
                position: { gt: currentPosition },
                status: { in: ['WAITING', 'ATTENDING'] },
              },
              data: {
                position: { decrement: 1 },
              },
            })
          }
        }

        return updated
      })
    })

    return NextResponse.json({ success: true, barber: updatedBarber })
  } catch (error: any) {
    console.error('Erro ao pausar/reativar barbeiro:', error)
    
    // Retornar erro específico
    if (error.message === 'Barbeiro não encontrado') {
      return NextResponse.json(
        { error: 'Barbeiro não encontrado' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { error: 'Erro ao pausar/reativar barbeiro. Tente novamente.' },
      { status: 500 }
    )
  }
}


