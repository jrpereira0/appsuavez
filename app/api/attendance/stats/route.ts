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

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const where: any = {
      barbershopId: barbershopId,
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

    if (session.user.role === 'BARBER') {
      where.userId = session.user.id
    } else if (userId) {
      where.userId = userId
    }

    const attendances = await prisma.attendance.findMany({
      where,
      select: {
        value: true,
        duration: true,
        serviceType: true,
      },
    })

    const totalAttendances = attendances.length
    
    const totalValue = attendances.reduce((sum, att) => {
      return sum + (att.value ? parseFloat(att.value.toString()) : 0)
    }, 0)

    const totalDuration = attendances.reduce((sum, att) => {
      return sum + (att.duration || 0)
    }, 0)

    const averageDuration = totalAttendances > 0 ? totalDuration / totalAttendances : 0

    // Agrupar por tipo de serviço
    const byServiceType: Record<string, { count: number; totalValue: number }> = {}
    
    attendances.forEach((att) => {
      const type = att.serviceType || 'Não especificado'
      if (!byServiceType[type]) {
        byServiceType[type] = { count: 0, totalValue: 0 }
      }
      byServiceType[type].count++
      byServiceType[type].totalValue += att.value ? parseFloat(att.value.toString()) : 0
    })

    const byServiceTypeArray = Object.entries(byServiceType).map(([type, data]) => ({
      serviceType: type,
      count: data.count,
      totalValue: data.totalValue,
    }))

    return NextResponse.json({
      totalAttendances,
      totalValue,
      averageDuration: Math.round(averageDuration),
      byServiceType: byServiceTypeArray,
    })
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar estatísticas' },
      { status: 500 }
    )
  }
}


