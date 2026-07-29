import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAvailabilityDto } from './dto/create-availability.dto';

@Injectable()
export class AvailabilityService {
  constructor(private prisma: PrismaService) {
    this.initializeDefaultAvailability();
  }

  private async initializeDefaultAvailability() {
    try {
      const coach = await this.prisma.coach.findFirst();
      if (!coach) return;

      const existingAvailability = await this.prisma.availability.findFirst({
        where: { coachId: coach.id },
      });

      if (!existingAvailability) {
        // Create default availability: Monday to Friday 9:00-17:00
        const defaultHours = [
          { dayOfWeek: 0, startTime: '09:00', endTime: '17:00' }, // Monday
          { dayOfWeek: 1, startTime: '09:00', endTime: '17:00' }, // Tuesday
          { dayOfWeek: 2, startTime: '09:00', endTime: '17:00' }, // Wednesday
          { dayOfWeek: 3, startTime: '09:00', endTime: '17:00' }, // Thursday
          { dayOfWeek: 4, startTime: '09:00', endTime: '17:00' }, // Friday
        ];

        for (const hours of defaultHours) {
          await this.prisma.availability.create({
            data: {
              coachId: coach.id,
              ...hours,
              isAvailable: true,
            },
          });
        }

        console.log('✅ Default availability initialized');
      }
    } catch (error) {
      console.log('Default availability already exists');
    }
  }

  async getAvailability() {
    const coach = await this.prisma.coach.findFirst();
    if (!coach) return [];

    return this.prisma.availability.findMany({
      where: { coachId: coach.id },
      orderBy: { dayOfWeek: 'asc' },
    });
  }

  async updateAvailability(dayOfWeek: number, createAvailabilityDto: CreateAvailabilityDto) {
    const coach = await this.prisma.coach.findFirst();
    if (!coach) throw new Error('Coach not found');

    const existing = await this.prisma.availability.findUnique({
      where: {
        coachId_dayOfWeek: {
          coachId: coach.id,
          dayOfWeek,
        },
      },
    });

    if (existing) {
      return this.prisma.availability.update({
        where: { id: existing.id },
        data: createAvailabilityDto,
      });
    }

    return this.prisma.availability.create({
      data: {
        coachId: coach.id,
        dayOfWeek,
        ...createAvailabilityDto,
      },
    });
  }

  async getAvailableSlots(date: Date) {
    const coach = await this.prisma.coach.findFirst();
    if (!coach) return [];

    // Convert JS getDay() to 0=Monday format (0=Sunday in JS, so we subtract 1, and if Sunday set to 6)
    const dayOfWeek = date.getDay() === 0 ? 6 : date.getDay() - 1;

    // Only allow Monday to Friday (0-4)
    if (dayOfWeek > 4) {
      return [];
    }

    const availability = await this.prisma.availability.findUnique({
      where: {
        coachId_dayOfWeek: {
          coachId: coach.id,
          dayOfWeek,
        },
      },
    });

    if (!availability || !availability.isAvailable) {
      return [];
    }

    // Check for unavailable dates
    const dateStart = new Date(date);
    dateStart.setHours(0, 0, 0, 0);
    const dateEnd = new Date(date);
    dateEnd.setHours(23, 59, 59, 999);

    const unavailableDate = await this.prisma.unavailableDate.findFirst({
      where: {
        coachId: coach.id,
        date: {
          gte: dateStart,
          lte: dateEnd,
        },
      },
    });

    if (unavailableDate) {
      return [];
    }

    // Predefined time slots: 9:00, 10:30, 12:00, 15:00, 16:30
    const predefinedSlots = ['09:00', '10:30', '12:00', '15:00', '16:30'];
    const slots = [];

    for (const timeSlot of predefinedSlots) {
      const [hour, minute] = timeSlot.split(':').map(Number);
      const slotStart = new Date(date);
      slotStart.setHours(hour, minute, 0, 0);

      const slotEnd = new Date(slotStart.getTime() + coach.sessionDurationMinutes * 60000);

      // Check if slot is already booked
      const isBooked = await this.prisma.booking.findFirst({
        where: {
          coachId: coach.id,
          sessionDate: {
            gte: dateStart,
            lte: dateEnd,
          },
          sessionStartTime: timeSlot,
          status: { in: ['CONFIRMED', 'PENDING'] },
        },
      });

      if (!isBooked) {
        slots.push({
          startTime: timeSlot,
          endTime: this.formatTime(slotEnd),
        });
      }
    }

    return slots;
  }

  private formatTime(date: Date): string {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  async markUnavailable(date: Date, reason?: string) {
    const coach = await this.prisma.coach.findFirst();
    if (!coach) throw new Error('Coach not found');

    return this.prisma.unavailableDate.create({
      data: {
        coachId: coach.id,
        date,
        reason,
      },
    });
  }

  async removeUnavailable(id: string) {
    return this.prisma.unavailableDate.delete({
      where: { id },
    });
  }

  async getUnavailableDates() {
    const coach = await this.prisma.coach.findFirst();
    if (!coach) return [];

    return this.prisma.unavailableDate.findMany({
      where: { coachId: coach.id },
      orderBy: { date: 'asc' },
    });
  }
}
