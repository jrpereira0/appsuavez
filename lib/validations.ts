import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
})

export const registerBarbershopSchema = z.object({
  barbershopName: z.string().min(3, 'Nome da barbearia deve ter no mínimo 3 caracteres'),
  ownerName: z.string().min(3, 'Nome do dono deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
})

export const createBarberSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
})

export const completeAttendanceSchema = z.object({
  serviceType: z.string().optional(),
  value: z.number().positive('Valor deve ser positivo').optional(),
  notes: z.string().optional(),
})

export const togglePauseSchema = z.object({
  userId: z.string(),
  pauseReason: z.string().optional(),
})

export const reorderQueueSchema = z.object({
  queueId: z.string(),
  newPosition: z.number().positive(),
})


