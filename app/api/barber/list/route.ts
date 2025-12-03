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

    const barbershopId = session.user.barbershopId!

    const barbers = await prisma.user.findMany({
      where: {
        barbershopId: barbershopId,
        role: 'BARBER',
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        pauseReason: true,
        pausedAt: true,
        createdAt: true,
      },
      orderBy: {
        name: 'asc',
      },
    })

    return NextResponse.json({ barbers })
  } catch (error) {
    console.error('Erro ao listar barbeiros:', error)
    return NextResponse.json(
      { error: 'Erro ao listar barbeiros' },
      { status: 500 }
    )
  }
}


