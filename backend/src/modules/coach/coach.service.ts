import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateCoachDto } from './dto/update-coach.dto';

@Injectable()
export class CoachService {
  constructor(private prisma: PrismaService) {
    this.initializeCoach();
  }

  private async initializeCoach() {
    try {
      const coachExists = await this.prisma.coach.findFirst();
      if (!coachExists) {
        await this.prisma.coach.create({
          data: {
            name: process.env.COACH_NAME || 'Professional Coach',
            title: process.env.COACH_TITLE || 'Life Coach',
            email: process.env.COACH_EMAIL || 'coach@example.com',
            phone: process.env.COACH_PHONE,
            whatsappNumber: process.env.WHATSAPP_PHONE_NUMBER,
            bio: process.env.COACH_BIO,
            photoUrl: process.env.COACH_PHOTO_URL,
            expertise: process.env.COACH_EXPERTISE,
            yearsOfExperience: parseInt(process.env.COACH_EXPERIENCE_YEARS || '10', 10),
            certifications: process.env.COACH_CERTIFICATIONS,
            sessionDurationMinutes: parseInt(process.env.SESSION_DURATION_MINUTES || '60', 10),
            sessionBufferMinutes: parseInt(process.env.SESSION_BUFFER_MINUTES || '15', 10),
          },
        });
        console.log('✅ Coach profile initialized');
      } else {
        // Update coach profile with latest environment variables
        await this.prisma.coach.update({
          where: { id: coachExists.id },
          data: {
            name: process.env.COACH_NAME || 'Professional Coach',
            title: process.env.COACH_TITLE || 'Life Coach',
            email: process.env.COACH_EMAIL || 'coach@example.com',
            phone: process.env.COACH_PHONE,
            whatsappNumber: process.env.WHATSAPP_PHONE_NUMBER,
            bio: process.env.COACH_BIO,
            photoUrl: process.env.COACH_PHOTO_URL,
            expertise: process.env.COACH_EXPERTISE,
            yearsOfExperience: parseInt(process.env.COACH_EXPERIENCE_YEARS || '10', 10),
            certifications: process.env.COACH_CERTIFICATIONS,
            sessionDurationMinutes: parseInt(process.env.SESSION_DURATION_MINUTES || '60', 10),
            sessionBufferMinutes: parseInt(process.env.SESSION_BUFFER_MINUTES || '15', 10),
          },
        });
        console.log('✅ Coach profile updated from environment variables');
      }
    } catch (error) {
      console.log('Error initializing coach profile:', error);
    }
  }

  async getProfile() {
    const coach = await this.prisma.coach.findFirst();
    if (!coach) {
      throw new NotFoundException('Coach profile not found');
    }
    return coach;
  }

  async updateProfile(updateCoachDto: UpdateCoachDto) {
    const coach = await this.prisma.coach.findFirst();
    if (!coach) {
      throw new NotFoundException('Coach profile not found');
    }

    return this.prisma.coach.update({
      where: { id: coach.id },
      data: updateCoachDto,
    });
  }

  async getCoachPublicProfile() {
    const coach = await this.prisma.coach.findFirst({
      select: {
        id: true,
        name: true,
        title: true,
        bio: true,
        photoUrl: true,
        expertise: true,
        yearsOfExperience: true,
        certifications: true,
        sessionDurationMinutes: true,
        whatsappNumber: true,
        socialMedia: true,
      },
    });

    if (!coach) {
      throw new NotFoundException('Coach profile not found');
    }

    return coach;
  }
}
