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

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const limit = searchParams.get('limit')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const where: any = {
      barbershopId: session.user.barbershopId,
      finishedAt: { not: null },
    }

    // Filtro de data - ajustar para considerar o dia inteiro
    if (startDate || endDate) {
      const dateFilter: any = { not: null }
      
      if (startDate) {
        const start = new Date(startDate)
        start.setHours(0, 0, 0, 0)
        dateFilter.gte = start
      }
      
      if (endDate) {
        const end = new Date(endDate)
        end.setHours(23, 59, 59, 999)
        dateFilter.lte = end
      }
      
      where.finishedAt = dateFilter
    }

    // Se for barbeiro, mostrar apenas seus atendimentos
    if (session.user.role === 'BARBER') {
      where.userId = session.user.id
    } else if (userId) {
      // Owner/Admin pode filtrar por barbeiro específico
      where.userId = userId
    }

    const attendances = await prisma.attendance.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        finishedAt: 'desc',
      },
      take: limit ? parseInt(limit) : undefined,
    })

    return NextResponse.json({ attendances })
  } catch (error) {
    console.error('Erro ao listar atendimentos:', error)
    return NextResponse.json(
      { error: 'Erro ao listar atendimentos' },
      { status: 500 }
    )
  }
}


