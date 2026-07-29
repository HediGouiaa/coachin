import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { GoogleCalendarService } from './google-calendar.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('google-calendar')
export class GoogleCalendarController {
  constructor(private googleCalendarService: GoogleCalendarService) {}

  @Get('auth-url')
  getAuthUrl() {
    return { authUrl: this.googleCalendarService.getAuthUrl() };
  }

  @Post('callback')
  async handleCallback(@Query('code') code: string) {
    try {
      const tokens = await this.googleCalendarService.getAccessToken(code);
      return { success: true, message: 'Google Calendar connected successfully' };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
  }

  @Get('status')
  @UseGuards(JwtAuthGuard)
  async getStatus() {
    return this.googleCalendarService.getStatus();
  }
}
