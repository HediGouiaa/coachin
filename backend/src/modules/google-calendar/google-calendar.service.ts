import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GoogleCalendarService {
  private oauth2Client: OAuth2Client;
  private calendar: any;

  constructor(private prisma: PrismaService) {
    this.oauth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URL,
    );

    this.initializeCalendar();
  }

  private async initializeCalendar() {
    try {
      const coach = await this.prisma.coach.findFirst();
      if (coach?.googleAccessToken) {
        this.oauth2Client.setCredentials({
          access_token: coach.googleAccessToken,
          refresh_token: coach.googleRefreshToken,
        });

        this.calendar = google.calendar({
          version: 'v3',
          auth: this.oauth2Client as any,
        });
        console.log('✅ Google Calendar initialized');
      }
    } catch (error) {
      console.log('Google Calendar not configured yet');
    }
  }

  getAuthUrl() {
    const scopes = ['https://www.googleapis.com/auth/calendar'];

    const url = this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
    });

    return url;
  }

  async getAccessToken(code: string) {
    try {
      const { tokens } = await this.oauth2Client.getToken(code);
      this.oauth2Client.setCredentials(tokens);

      const coach = await this.prisma.coach.findFirst();
      if (coach) {
        await this.prisma.coach.update({
          where: { id: coach.id },
          data: {
            googleAccessToken: tokens.access_token,
            googleRefreshToken: tokens.refresh_token,
            googleCalendarId: 'primary',
          },
        });

        this.calendar = google.calendar({
          version: 'v3',
          auth: this.oauth2Client as any,
        });
      }

      return tokens;
    } catch (error) {
      console.error('Failed to get access token:', error);
      throw error;
    }
  }

  async createEvent(booking: any) {
    try {
      if (!this.calendar) {
        console.log('Google Calendar not initialized');
        return null;
      }

      const coach = await this.prisma.coach.findFirst();
      if (!coach) return null;

      const sessionDate = new Date(booking.sessionDate);
      const [startHour, startMinute] = booking.sessionStartTime.split(':').map(Number);
      const [endHour, endMinute] = booking.sessionEndTime.split(':').map(Number);

      const startDateTime = new Date(sessionDate);
      startDateTime.setHours(startHour, startMinute, 0, 0);

      const endDateTime = new Date(sessionDate);
      endDateTime.setHours(endHour, endMinute, 0, 0);

      const event = {
        summary: `Coaching Session: ${booking.subject}`,
        description: `Client: ${booking.clientName}\nEmail: ${booking.clientEmail}\nPhone: ${booking.clientPhone}${booking.clientMessage ? `\nMessage: ${booking.clientMessage}` : ''}`,
        start: {
          dateTime: startDateTime.toISOString(),
          timeZone: coach.timezone || 'UTC',
        },
        end: {
          dateTime: endDateTime.toISOString(),
          timeZone: coach.timezone || 'UTC',
        },
        attendees: [
          { email: booking.clientEmail, displayName: booking.clientName },
          { email: coach.email },
        ],
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 },
            { method: 'popup', minutes: 30 },
          ],
        },
      };

      const response = await this.calendar.events.insert({
        calendarId: coach.googleCalendarId || 'primary',
        resource: event,
        sendUpdates: 'all',
      });

      console.log('Event created:', response.data.id);
      return response.data.id;
    } catch (error) {
      console.error('Failed to create Google Calendar event:', error);
      return null;
    }
  }

  async deleteEvent(eventId: string) {
    try {
      if (!this.calendar) {
        console.log('Google Calendar not initialized');
        return;
      }

      const coach = await this.prisma.coach.findFirst();
      if (!coach) return;

      await this.calendar.events.delete({
        calendarId: coach.googleCalendarId || 'primary',
        eventId,
        sendUpdates: 'all',
      });

      console.log('Event deleted:', eventId);
    } catch (error) {
      console.error('Failed to delete Google Calendar event:', error);
    }
  }

  async updateEvent(eventId: string, booking: any) {
    try {
      if (!this.calendar) {
        console.log('Google Calendar not initialized');
        return;
      }

      const coach = await this.prisma.coach.findFirst();
      if (!coach) return;

      const sessionDate = new Date(booking.sessionDate);
      const [startHour, startMinute] = booking.sessionStartTime.split(':').map(Number);
      const [endHour, endMinute] = booking.sessionEndTime.split(':').map(Number);

      const startDateTime = new Date(sessionDate);
      startDateTime.setHours(startHour, startMinute, 0, 0);

      const endDateTime = new Date(sessionDate);
      endDateTime.setHours(endHour, endMinute, 0, 0);

      const event = {
        summary: `Coaching Session: ${booking.subject}`,
        description: `Client: ${booking.clientName}\nEmail: ${booking.clientEmail}\nPhone: ${booking.clientPhone}${booking.clientMessage ? `\nMessage: ${booking.clientMessage}` : ''}`,
        start: {
          dateTime: startDateTime.toISOString(),
          timeZone: coach.timezone || 'UTC',
        },
        end: {
          dateTime: endDateTime.toISOString(),
          timeZone: coach.timezone || 'UTC',
        },
      };

      await this.calendar.events.update({
        calendarId: coach.googleCalendarId || 'primary',
        eventId,
        resource: event,
        sendUpdates: 'all',
      });

      console.log('Event updated:', eventId);
    } catch (error) {
      console.error('Failed to update Google Calendar event:', error);
    }
  }

  async getStatus() {
    const coach = await this.prisma.coach.findFirst();
    return {
      isConnected: !!coach?.googleAccessToken,
      calenderId: coach?.googleCalendarId,
    };
  }
}
