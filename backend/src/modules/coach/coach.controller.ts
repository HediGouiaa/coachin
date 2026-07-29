import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { CoachService } from './coach.service';
import { UpdateCoachDto } from './dto/update-coach.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('coach')
export class CoachController {
  constructor(private coachService: CoachService) {}

  @Get('profile')
  async getPublicProfile() {
    return this.coachService.getCoachPublicProfile();
  }

  @Get('admin/profile')
  @UseGuards(JwtAuthGuard)
  async getProfile() {
    return this.coachService.getProfile();
  }

  @Put('admin/profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(@Body() updateCoachDto: UpdateCoachDto) {
    return this.coachService.updateProfile(updateCoachDto);
  }
}
