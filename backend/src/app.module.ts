import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './modules/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { CoachModule } from './modules/coach/coach.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { AvailabilityModule } from './modules/availability/availability.module';
import { EmailModule } from './modules/email/email.module';
import { EventsModule } from './modules/events/events.module';
import { GoogleCalendarModule } from './modules/google-calendar/google-calendar.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    CoachModule,
    BookingsModule,
    AvailabilityModule,
    EmailModule,
    EventsModule,
    GoogleCalendarModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
