import { Role, QueueStatus } from '@prisma/client'

export type { Role, QueueStatus }

export interface User {
  id: string
  email: string
  name: string
  role: Role
  isActive: boolean
  pauseReason?: string | null
  pausedAt?: Date | null
  barbershopId?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Barbershop {
  id: string
  name: string
  slug: string
  ownerId: string
  createdAt: Date
  updatedAt: Date
}

export interface QueueItem {
  id: string
  position: number
  status: QueueStatus
  userId: string
  barbershopId: string
  user: {
    id: string
    name: string
    email: string
    isActive: boolean
    pauseReason?: string | null
  }
  createdAt: Date
  updatedAt: Date
}

export interface Attendance {
  id: string
  barbershopId: string
  userId: string
  startedAt: Date
  finishedAt?: Date | null
  duration?: number | null
  serviceType?: string | null
  value?: number | null
  notes?: string | null
  user: {
    id: string
    name: string
  }
  createdAt: Date
}

export interface AttendanceStats {
  totalAttendances: number
  totalValue: number
  averageDuration: number
  byServiceType: {
    serviceType: string
    count: number
    totalValue: number
  }[]
}


