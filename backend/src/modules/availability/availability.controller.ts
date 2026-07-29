import { Controller, Get, Put, Post, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AvailabilityService } from './availability.service';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('availability')
export class AvailabilityController {
  constructor(private availabilityService: AvailabilityService) {}

  @Get()
  async getAvailability() {
    return this.availabilityService.getAvailability();
  }

  @Get('slots')
  async getAvailableSlots(@Query('date') dateString: string) {
    const date = new Date(dateString);
    return this.availabilityService.getAvailableSlots(date);
  }

  @Get('unavailable-dates')
  @UseGuards(JwtAuthGuard)
  async getUnavailableDates() {
    return this.availabilityService.getUnavailableDates();
  }

  @Put(':dayOfWeek')
  @UseGuards(JwtAuthGuard)
  async updateAvailability(
    @Param('dayOfWeek') dayOfWeek: string,
    @Body() createAvailabilityDto: CreateAvailabilityDto,
  ) {
    return this.availabilityService.updateAvailability(parseInt(dayOfWeek), createAvailabilityDto);
  }

  @Post('unavailable-date')
  @UseGuards(JwtAuthGuard)
  async markUnavailable(
    @Body() { date, reason }: { date: string; reason?: string },
  ) {
    return this.availabilityService.markUnavailable(new Date(date), reason);
  }

  @Delete('unavailable-date/:id')
  @UseGuards(JwtAuthGuard)
  async removeUnavailable(@Param('id') id: string) {
    return this.availabilityService.removeUnavailable(id);
  }
}
