import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Limpar dados existentes
  await prisma.attendance.deleteMany()
  await prisma.queue.deleteMany()
  await prisma.user.deleteMany()
  await prisma.barbershop.deleteMany()

  // Criar barbearia de teste
  const hashedPassword = await bcrypt.hash('123456', 10)

  const barbershop = await prisma.barbershop.create({
    data: {
      name: 'Barbearia Exemplo',
      slug: 'barbearia-exemplo',
      owner: {
        create: {
          name: 'João Silva',
          email: 'dono@exemplo.com',
          password: hashedPassword,
          role: 'OWNER',
        },
      },
    },
  })

  console.log('✅ Barbearia criada:', barbershop.name)

  // Criar barbeiros de teste
  // Criar barbeiros e suas entradas na fila
  const barber1 = await prisma.user.create({
    data: {
      name: 'Carlos Souza',
      email: 'carlos@exemplo.com',
      password: hashedPassword,
      role: 'BARBER',
      barbershopId: barbershop.id,
      queues: {
        create: {
          position: 1,
          status: 'WAITING',
          barbershopId: barbershop.id,
        },
      },
    },
  })

  const barber2 = await prisma.user.create({
    data: {
      name: 'Pedro Santos',
      email: 'pedro@exemplo.com',
      password: hashedPassword,
      role: 'BARBER',
      barbershopId: barbershop.id,
      queues: {
        create: {
          position: 2,
          status: 'WAITING',
          barbershopId: barbershop.id,
        },
      },
    },
  })

  const barber3 = await prisma.user.create({
    data: {
      name: 'Lucas Oliveira',
      email: 'lucas@exemplo.com',
      password: hashedPassword,
      role: 'BARBER',
      barbershopId: barbershop.id,
      queues: {
        create: {
          position: 3,
          status: 'WAITING',
          barbershopId: barbershop.id,
        },
      },
    },
  })

  console.log('✅ Barbeiros criados com suas posições na fila:', barber1.name, barber2.name, barber3.name)

  console.log('\n📝 Credenciais de acesso:')
  console.log('Dono - Email: dono@exemplo.com | Senha: 123456')
  console.log('Barbeiro 1 - Email: carlos@exemplo.com | Senha: 123456')
  console.log('Barbeiro 2 - Email: pedro@exemplo.com | Senha: 123456')
  console.log('Barbeiro 3 - Email: lucas@exemplo.com | Senha: 123456')
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })


