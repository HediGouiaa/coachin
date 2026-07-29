import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { GoogleCalendarService } from '../google-calendar/google-calendar.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
    private googleCalendarService: GoogleCalendarService,
  ) {}

  async createBooking(createBookingDto: CreateBookingDto) {
    console.log('📅 New booking request:', createBookingDto);
    
    const coach = await this.prisma.coach.findFirst();
    if (!coach) {
      throw new NotFoundException('Coach not found');
    }

    // Check if slot is already booked
    const existingBooking = await this.prisma.booking.findFirst({
      where: {
        coachId: coach.id,
        sessionDate: {
          gte: new Date(createBookingDto.sessionDate),
          lte: new Date(new Date(createBookingDto.sessionDate).getTime() + 24 * 60 * 60 * 1000),
        },
        sessionStartTime: createBookingDto.sessionStartTime,
        status: { in: ['CONFIRMED', 'PENDING'] },
      },
    });

    if (existingBooking) {
      throw new BadRequestException('This time slot is already booked');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(createBookingDto.clientEmail)) {
      throw new BadRequestException('Invalid email format');
    }

    // Calculate end time
    const endTime = this.calculateEndTime(
      createBookingDto.sessionStartTime,
      coach.sessionDurationMinutes,
    );

    const booking = await this.prisma.booking.create({
      data: {
        coachId: coach.id,
        clientName: createBookingDto.clientName,
        clientEmail: createBookingDto.clientEmail,
        clientPhone: createBookingDto.clientPhone,
        clientMessage: createBookingDto.clientMessage,
        subject: createBookingDto.subject,
        sessionDate: new Date(createBookingDto.sessionDate),
        sessionStartTime: createBookingDto.sessionStartTime,
        sessionEndTime: endTime,
        sessionDurationMinutes: coach.sessionDurationMinutes,
        status: 'PENDING',
      },
    });

    console.log('✅ Booking saved to database:', { id: booking.id, clientName: booking.clientName, status: booking.status });

    // Send confirmation email to client
    try {
      await this.emailService.sendBookingConfirmation(booking, coach);
      await this.prisma.booking.update({
        where: { id: booking.id },
        data: { confirmationEmailSent: true },
      });
    } catch (error) {
      console.error('Failed to send confirmation email:', error);
    }

    // Send notification to coach
    try {
      await this.emailService.sendBookingNotificationToCoach(booking, coach);
    } catch (error) {
      console.error('Failed to send coach notification:', error);
    }

    // Send notification to admin
    try {
      await this.emailService.sendBookingNotificationToAdmin(booking, coach);
    } catch (error) {
      console.error('Failed to send admin notification:', error);
    }

    return booking;
  }

  async confirmBooking(bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { coach: true },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Create Google Calendar event
    try {
      const eventId = await this.googleCalendarService.createEvent(booking);
      if (eventId) {
        booking.googleCalendarEventId = eventId;
      }
    } catch (error) {
      console.error('Failed to create Google Calendar event:', error);
    }

    const updatedBooking = await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'CONFIRMED',
        googleCalendarEventId: booking.googleCalendarEventId,
      },
      include: { coach: true },
    });

    // Send confirmation to client with calendar invite
    try {
      await this.emailService.sendBookingConfirmed(updatedBooking, booking.coach);
    } catch (error) {
      console.error('Failed to send confirmation:', error);
    }

    return updatedBooking;
  }

  async approveBooking(bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { coach: true },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Create Google Calendar event
    try {
      const eventId = await this.googleCalendarService.createEvent(booking);
      if (eventId) {
        booking.googleCalendarEventId = eventId;
      }
    } catch (error) {
      console.error('Failed to create Google Calendar event:', error);
    }

    const updatedBooking = await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'CONFIRMED',
        googleCalendarEventId: booking.googleCalendarEventId,
      },
      include: { coach: true },
    });

    // Send approval email to client
    try {
      await this.emailService.sendBookingConfirmed(updatedBooking, booking.coach);
    } catch (error) {
      console.error('Failed to send approval email:', error);
    }

    return updatedBooking;
  }

  async rejectBooking(bookingId: string, reason?: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { coach: true },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    const updatedBooking = await this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'CANCELLED' },
      include: { coach: true },
    });

    // Send rejection email to client
    try {
      await this.emailService.sendBookingRejection(updatedBooking, booking.coach, reason);
    } catch (error) {
      console.error('Failed to send rejection email:', error);
    }

    return updatedBooking;
  }

  async cancelBooking(bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { coach: true },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Delete Google Calendar event
    if (booking.googleCalendarEventId) {
      try {
        await this.googleCalendarService.deleteEvent(booking.googleCalendarEventId);
      } catch (error) {
        console.error('Failed to delete Google Calendar event:', error);
      }
    }

    const updatedBooking = await this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'CANCELLED' },
      include: { coach: true },
    });

    // Send cancellation email
    try {
      await this.emailService.sendBookingCancellation(updatedBooking, booking.coach);
    } catch (error) {
      console.error('Failed to send cancellation email:', error);
    }

    return updatedBooking;
  }

  async getAllBookings(filters?: { status?: string; startDate?: string; endDate?: string }) {
    const coach = await this.prisma.coach.findFirst();
    if (!coach) {
      throw new NotFoundException('Coach not found');
    }

    const where: any = { coachId: coach.id };

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.startDate) {
      where.sessionDate = { gte: new Date(filters.startDate) };
    }

    if (filters?.endDate) {
      if (where.sessionDate) {
        where.sessionDate.lte = new Date(filters.endDate);
      } else {
        where.sessionDate = { lte: new Date(filters.endDate) };
      }
    }

    return this.prisma.booking.findMany({
      where,
      orderBy: { sessionDate: 'asc' },
      include: { coach: true },
    });
  }

  async getBookingById(bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { coach: true },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return booking;
  }

  async getUpcomingBookings() {
    const coach = await this.prisma.coach.findFirst();
    if (!coach) {
      throw new NotFoundException('Coach not found');
    }

    return this.prisma.booking.findMany({
      where: {
        coachId: coach.id,
        sessionDate: { gte: new Date() },
        status: { in: ['CONFIRMED', 'PENDING'] },
      },
      orderBy: { sessionDate: 'asc' },
      take: 10,
    });
  }

  async getTodayBookings() {
    const coach = await this.prisma.coach.findFirst();
    if (!coach) {
      throw new NotFoundException('Coach not found');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.prisma.booking.findMany({
      where: {
        coachId: coach.id,
        sessionDate: { gte: today, lt: tomorrow },
        status: { in: ['CONFIRMED', 'PENDING'] },
      },
      orderBy: { sessionStartTime: 'asc' },
    });
  }

  async getBookingStats() {
    const coach = await this.prisma.coach.findFirst();
    if (!coach) {
      throw new NotFoundException('Coach not found');
    }

    const [total, upcoming, confirmed, pending, cancelled] = await Promise.all([
      this.prisma.booking.count({
        where: { coachId: coach.id },
      }),
      this.prisma.booking.count({
        where: {
          coachId: coach.id,
          sessionDate: { gte: new Date() },
        },
      }),
      this.prisma.booking.count({
        where: { coachId: coach.id, status: 'CONFIRMED' },
      }),
      this.prisma.booking.count({
        where: { coachId: coach.id, status: 'PENDING' },
      }),
      this.prisma.booking.count({
        where: { coachId: coach.id, status: 'CANCELLED' },
      }),
    ]);

    return { total, upcoming, confirmed, pending, cancelled };
  }

  private calculateEndTime(startTime: string, durationMinutes: number): string {
    const [hours, minutes] = startTime.split(':').map(Number);
    let endHours = hours;
    let endMinutes = minutes + durationMinutes;

    if (endMinutes >= 60) {
      endHours += Math.floor(endMinutes / 60);
      endMinutes = endMinutes % 60;
    }

    return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
  }
}
