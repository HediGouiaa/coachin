import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async createEvent(createEventDto: CreateEventDto) {
    const coach = await this.prisma.coach.findFirst();
    if (!coach) {
      throw new NotFoundException('Coach not found');
    }

    return this.prisma.specialEvent.create({
      data: {
        coachId: coach.id,
        title: createEventDto.title,
        description: createEventDto.description,
        image: createEventDto.image,
        location: createEventDto.location,
        eventDate: new Date(createEventDto.eventDate),
        eventTime: createEventDto.eventTime,
        registrationLink: createEventDto.registrationLink,
        isPublished: createEventDto.isPublished || false,
      },
    });
  }

  async getPublishedEvents() {
    const coach = await this.prisma.coach.findFirst();
    if (!coach) {
      throw new NotFoundException('Coach not found');
    }

    const events = await this.prisma.specialEvent.findMany({
      where: {
        coachId: coach.id,
        isPublished: true,
      },
      orderBy: { eventDate: 'asc' },
    });

    return events.length > 0 ? events : { message: 'Coming Soon' };
  }

  async getAllEvents() {
    const coach = await this.prisma.coach.findFirst();
    if (!coach) {
      throw new NotFoundException('Coach not found');
    }

    return this.prisma.specialEvent.findMany({
      where: { coachId: coach.id },
      orderBy: { eventDate: 'desc' },
    });
  }

  async getEventById(id: string) {
    const event = await this.prisma.specialEvent.findUnique({
      where: { id },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return event;
  }

  async updateEvent(id: string, updateEventDto: UpdateEventDto) {
    const event = await this.prisma.specialEvent.findUnique({
      where: { id },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return this.prisma.specialEvent.update({
      where: { id },
      data: {
        ...updateEventDto,
        eventDate: updateEventDto.eventDate ? new Date(updateEventDto.eventDate) : undefined,
      },
    });
  }

  async deleteEvent(id: string) {
    const event = await this.prisma.specialEvent.findUnique({
      where: { id },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return this.prisma.specialEvent.delete({
      where: { id },
    });
  }

  async publishEvent(id: string) {
    return this.updateEvent(id, { isPublished: true });
  }

  async unpublishEvent(id: string) {
    return this.updateEvent(id, { isPublished: false });
  }
}
