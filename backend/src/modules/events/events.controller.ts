import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('events')
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @Get('public')
  async getPublishedEvents() {
    return this.eventsService.getPublishedEvents();
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllEvents() {
    return this.eventsService.getAllEvents();
  }

  @Get(':id')
  async getEventById(@Param('id') id: string) {
    return this.eventsService.getEventById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(201)
  async createEvent(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.createEvent(createEventDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateEvent(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    return this.eventsService.updateEvent(id, updateEventDto);
  }

  @Put(':id/publish')
  @UseGuards(JwtAuthGuard)
  async publishEvent(@Param('id') id: string) {
    return this.eventsService.publishEvent(id);
  }

  @Put(':id/unpublish')
  @UseGuards(JwtAuthGuard)
  async unpublishEvent(@Param('id') id: string) {
    return this.eventsService.unpublishEvent(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  async deleteEvent(@Param('id') id: string) {
    await this.eventsService.deleteEvent(id);
  }
}
