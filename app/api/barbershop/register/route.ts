import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateSlug } from '@/lib/utils'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { barbershopName, ownerName, email, password } = body

    // Validações
    if (!barbershopName || !ownerName || !email || !password) {
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

    // Gerar slug único
    let slug = generateSlug(barbershopName)
    let slugExists = await prisma.barbershop.findUnique({
      where: { slug },
    })

    let counter = 1
    while (slugExists) {
      slug = `${generateSlug(barbershopName)}-${counter}`
      slugExists = await prisma.barbershop.findUnique({
        where: { slug },
      })
      counter++
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10)

    // Criar barbearia e dono em uma transação
    const barbershop = await prisma.barbershop.create({
      data: {
        name: barbershopName,
        slug,
        owner: {
          create: {
            name: ownerName,
            email,
            password: hashedPassword,
            role: 'OWNER',
          },
        },
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      barbershop: {
        id: barbershop.id,
        name: barbershop.name,
        slug: barbershop.slug,
      },
      owner: barbershop.owner,
    })
  } catch (error) {
    console.error('Erro ao cadastrar barbearia:', error)
    return NextResponse.json(
      { error: 'Erro ao cadastrar barbearia' },
      { status: 500 }
    )
  }
}


