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
    const { userId, name, email } = body

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
      },
    })

    if (!barber) {
      return NextResponse.json(
        { error: 'Barbeiro não encontrado' },
        { status: 404 }
      )
    }

    const updatedBarber = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(email && { email }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true,
      },
    })

    return NextResponse.json({ success: true, barber: updatedBarber })
  } catch (error) {
    console.error('Erro ao atualizar barbeiro:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar barbeiro' },
      { status: 500 }
    )
  }
}


