import axios, { AxiosInstance } from 'axios'
import { AuthResponse, Booking, Coach, TimeSlot, SpecialEvent, BookingStats, AdminProfile } from '../types'

const API_URL = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env?.VITE_API_URL || 'http://localhost:3000'

class ApiService {
  private api: AxiosInstance
  private token: string | null = null

  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Load token from localStorage
    this.token = localStorage.getItem('token')
    if (this.token) {
      this.setAuthHeader(this.token)
    }

    // Add request interceptor for authentication
    this.api.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.clearAuth()
        }
        return Promise.reject(error)
      }
    )
  }

  setAuthHeader(token: string) {
    this.token = token
    this.api.defaults.headers.Authorization = `Bearer ${token}`
  }

  clearAuth() {
    this.token = null
    localStorage.removeItem('token')
    delete this.api.defaults.headers.Authorization
  }

  // Auth endpoints
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/auth/login', { email, password })
    return response.data
  }

  async logout(): Promise<void> {
    await this.api.post('/auth/logout')
    this.clearAuth()
  }

  async getAdminProfile(): Promise<AdminProfile> {
    const response = await this.api.get<AdminProfile>('/auth/profile')
    return response.data
  }

  // Coach endpoints
  async getCoachPublicProfile(): Promise<Coach> {
    const response = await this.api.get<Coach>('/coach/profile')
    return response.data
  }

  async getCoachProfile(): Promise<Coach> {
    const response = await this.api.get<Coach>('/coach/admin/profile')
    return response.data
  }

  async updateCoachProfile(coachData: Partial<Coach>): Promise<Coach> {
    const response = await this.api.put<Coach>('/coach/admin/profile', coachData)
    return response.data
  }

  // Availability endpoints
  async getAvailability(): Promise<any[]> {
    const response = await this.api.get('/availability')
    return response.data
  }

  async getAvailableSlots(date: string): Promise<TimeSlot[]> {
    const response = await this.api.get<TimeSlot[]>('/availability/slots', {
      params: { date },
    })
    return response.data
  }

  async updateAvailability(dayOfWeek: number, data: any): Promise<any> {
    const response = await this.api.put(`/availability/${dayOfWeek}`, data)
    return response.data
  }

  async getUnavailableDates(): Promise<any[]> {
    const response = await this.api.get('/availability/unavailable-dates')
    return response.data
  }

  async markUnavailable(date: string, reason?: string): Promise<any> {
    const response = await this.api.post('/availability/unavailable-date', { date, reason })
    return response.data
  }

  async removeUnavailable(id: string): Promise<void> {
    await this.api.delete(`/availability/unavailable-date/${id}`)
  }

  // Booking endpoints
  async createBooking(bookingData: {
    clientName: string
    clientEmail: string
    clientPhone: string
    subject: string
    clientMessage?: string
    sessionDate: string
    sessionStartTime: string
  }): Promise<Booking> {
    const response = await this.api.post<Booking>('/bookings', bookingData)
    return response.data
  }

  async getAllBookings(filters?: {
    status?: string
    startDate?: string
    endDate?: string
  }): Promise<Booking[]> {
    const response = await this.api.get<Booking[]>('/bookings', { params: filters })
    return response.data
  }

  async getBookingById(id: string): Promise<Booking> {
    const response = await this.api.get<Booking>(`/bookings/${id}`)
    return response.data
  }

  async confirmBooking(id: string): Promise<Booking> {
    const response = await this.api.put<Booking>(`/bookings/${id}/confirm`, {})
    return response.data
  }

  async approveBooking(id: string): Promise<Booking> {
    const response = await this.api.put<Booking>(`/bookings/${id}/approve`, {})
    return response.data
  }

  async rejectBooking(id: string, reason?: string): Promise<Booking> {
    const response = await this.api.put<Booking>(`/bookings/${id}/reject`, { reason })
    return response.data
  }

  async cancelBooking(id: string): Promise<Booking> {
    const response = await this.api.put<Booking>(`/bookings/${id}/cancel`, {})
    return response.data
  }

  async deleteBooking(id: string): Promise<void> {
    await this.api.delete(`/bookings/${id}`)
  }

  async getBookingStats(): Promise<BookingStats> {
    const response = await this.api.get<BookingStats>('/bookings/admin/stats')
    return response.data
  }

  async getTodayBookings(): Promise<Booking[]> {
    const response = await this.api.get<Booking[]>('/bookings/admin/today')
    return response.data
  }

  // Events endpoints
  async getPublishedEvents(): Promise<SpecialEvent[]> {
    const response = await this.api.get<SpecialEvent[]>('/events/public')
    return response.data
  }

  async getAllEvents(): Promise<SpecialEvent[]> {
    const response = await this.api.get<SpecialEvent[]>('/events')
    return response.data
  }

  async getEventById(id: string): Promise<SpecialEvent> {
    const response = await this.api.get<SpecialEvent>(`/events/${id}`)
    return response.data
  }

  async createEvent(eventData: any): Promise<SpecialEvent> {
    const response = await this.api.post<SpecialEvent>('/events', eventData)
    return response.data
  }

  async updateEvent(id: string, eventData: any): Promise<SpecialEvent> {
    const response = await this.api.put<SpecialEvent>(`/events/${id}`, eventData)
    return response.data
  }

  async publishEvent(id: string): Promise<SpecialEvent> {
    const response = await this.api.put<SpecialEvent>(`/events/${id}/publish`, {})
    return response.data
  }

  async unpublishEvent(id: string): Promise<SpecialEvent> {
    const response = await this.api.put<SpecialEvent>(`/events/${id}/unpublish`, {})
    return response.data
  }

  async deleteEvent(id: string): Promise<void> {
    await this.api.delete(`/events/${id}`)
  }

  // Google Calendar endpoints
  async getGoogleCalendarAuthUrl(): Promise<{ authUrl: string }> {
    const response = await this.api.get('/google-calendar/auth-url')
    return response.data
  }

  async handleGoogleCalendarCallback(code: string): Promise<any> {
    const response = await this.api.post('/google-calendar/callback', {}, { params: { code } })
    return response.data
  }

  async getGoogleCalendarStatus(): Promise<any> {
    const response = await this.api.get('/google-calendar/status')
    return response.data
  }
}

export default new ApiService()
