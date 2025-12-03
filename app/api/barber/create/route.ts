import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== 'OWNER' && session.user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const barbershopId = session.user.barbershopId!

    const body = await request.json()
    const { name, email, password } = body

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      )
    }

    // Verificar se email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email já cadastrado' },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    // Buscar última posição na fila
    const lastQueue = await prisma.queue.findFirst({
      where: {
        barbershopId: barbershopId,
        status: 'WAITING',
      },
      orderBy: {
        position: 'desc',
      },
    })

    const newPosition = (lastQueue?.position || 0) + 1

    // Criar barbeiro e entrada na fila em transação
    const barber = await prisma.$transaction(async (tx) => {
      const newBarber = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: 'BARBER',
          barbershopId: barbershopId,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
        },
      })

      // Criar entrada na fila automaticamente
      await tx.queue.create({
        data: {
          userId: newBarber.id,
          barbershopId: barbershopId!,
          position: newPosition,
          status: 'WAITING',
        },
      })

      return newBarber
    })

    return NextResponse.json({ success: true, barber })
  } catch (error) {
    console.error('Erro ao criar barbeiro:', error)
    return NextResponse.json(
      { error: 'Erro ao criar barbeiro' },
      { status: 500 }
    )
  }
}


