import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('bookings')
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @Post()
  @HttpCode(201)
  async createBooking(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.createBooking(createBookingDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllBookings(
    @Query('status') status?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    console.log('📋 Fetching bookings with filters:', { status, startDate, endDate });
    const bookings = await this.bookingsService.getAllBookings({ status, startDate, endDate });
    console.log(`📊 Found ${bookings.length} bookings`);
    return bookings;
  }

  @Get('public/upcoming')
  async getUpcomingBookings() {
    return this.bookingsService.getUpcomingBookings();
  }

  @Get('admin/stats')
  @UseGuards(JwtAuthGuard)
  async getStats() {
    return this.bookingsService.getBookingStats();
  }

  @Get('admin/today')
  @UseGuards(JwtAuthGuard)
  async getTodayBookings() {
    return this.bookingsService.getTodayBookings();
  }

  @Get(':id')
  async getBookingById(@Param('id') id: string) {
    return this.bookingsService.getBookingById(id);
  }

  @Put(':id/confirm')
  @UseGuards(JwtAuthGuard)
  async confirmBooking(@Param('id') id: string) {
    return this.bookingsService.confirmBooking(id);
  }

  @Put(':id/approve')
  @UseGuards(JwtAuthGuard)
  async approveBooking(@Param('id') id: string) {
    return this.bookingsService.approveBooking(id);
  }

  @Put(':id/reject')
  @UseGuards(JwtAuthGuard)
  async rejectBooking(@Param('id') id: string, @Body() body?: { reason?: string }) {
    return this.bookingsService.rejectBooking(id, body?.reason);
  }

  @Put(':id/cancel')
  @UseGuards(JwtAuthGuard)
  async cancelBooking(@Param('id') id: string) {
    return this.bookingsService.cancelBooking(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  async deleteBooking(@Param('id') id: string) {
    await this.bookingsService.cancelBooking(id);
  }
}
