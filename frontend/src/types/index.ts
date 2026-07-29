export interface Coach {
  id: string
  name: string
  title: string
  bio?: string
  photoUrl?: string
  expertise?: string
  yearsOfExperience?: number
  certifications?: string
  sessionDurationMinutes: number
  whatsappNumber?: string
  socialMedia?: {
    twitter?: string
    linkedin?: string
    facebook?: string
    instagram?: string
  }
}

export interface Booking {
  id: string
  clientName: string
  clientEmail: string
  clientPhone: string
  subject: string
  clientMessage?: string
  sessionDate: string
  sessionStartTime: string
  sessionEndTime: string
  sessionDurationMinutes: number
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
  googleCalendarEventId?: string
  createdAt: string
  updatedAt: string
}

export interface Availability {
  id: string
  dayOfWeek: number
  startTime: string
  endTime: string
  isAvailable: boolean
}

export interface TimeSlot {
  startTime: string
  endTime: string
}

export interface SpecialEvent {
  id: string
  title: string
  description?: string
  image?: string
  location?: string
  eventDate: string
  eventTime?: string
  registrationLink?: string
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

export interface BookingStats {
  total: number
  upcoming: number
  confirmed: number
  pending: number
  cancelled: number
}

export interface AuthResponse {
  accessToken: string
  expiresIn: string
}

export interface AdminProfile {
  id: string
  email: string
  name: string
  role: string
  isActive: boolean
  createdAt: string
}
