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

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

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
        barbershopId: session.user.barbershopId,
        role: 'BARBER',
      },
    })

    if (!barber) {
      return NextResponse.json(
        { error: 'Barbeiro não encontrado' },
        { status: 404 }
      )
    }

    // Deletar em transação (barbeiro + entrada na fila)
    await prisma.$transaction(async (tx) => {
      // Deletar entrada na fila
      await tx.queue.deleteMany({
        where: {
          userId: userId,
          barbershopId: session.user.barbershopId,
        },
      })

      // Deletar barbeiro
      await tx.user.delete({
        where: { id: userId },
      })
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao deletar barbeiro:', error)
    return NextResponse.json(
      { error: 'Erro ao deletar barbeiro' },
      { status: 500 }
    )
  }
}


