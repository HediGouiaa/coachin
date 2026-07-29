import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {
    this.initializeAdmin();
  }

  // Initialize default admin on startup
  private async initializeAdmin() {
    try {
      const adminExists = await this.prisma.admin.findUnique({
        where: { email: process.env.ADMIN_EMAIL || 'admin@coachingplatform.com' },
      });

      if (!adminExists) {
        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@123456', 10);
        await this.prisma.admin.create({
          data: {
            email: process.env.ADMIN_EMAIL || 'admin@coachingplatform.com',
            password: hashedPassword,
            name: 'Admin',
          },
        });
        console.log('✅ Default admin created');
      }
    } catch (error) {
      console.log('Admin initialization check completed');
    }
  }

  async register(createAdminDto: CreateAdminDto) {
    const existingAdmin = await this.prisma.admin.findUnique({
      where: { email: createAdminDto.email },
    });

    if (existingAdmin) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(createAdminDto.password, 10);

    const admin = await this.prisma.admin.create({
      data: {
        email: createAdminDto.email,
        password: hashedPassword,
        name: createAdminDto.name,
      },
    });

    return this.generateToken(admin.id, admin.email);
  }

  async login(loginDto: LoginDto) {
    const admin = await this.prisma.admin.findUnique({
      where: { email: loginDto.email },
    });

    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, admin.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!admin.isActive) {
      throw new UnauthorizedException('Account is disabled');
    }

    return this.generateToken(admin.id, admin.email);
  }

  async getAdminProfile(adminId: string) {
    const admin = await this.prisma.admin.findUnique({
      where: { id: adminId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    if (!admin) {
      throw new UnauthorizedException('Admin not found');
    }

    return admin;
  }

  private generateToken(adminId: string, email: string) {
    const token = this.jwtService.sign({
      sub: adminId,
      email,
    });

    return {
      accessToken: token,
      expiresIn: process.env.JWT_EXPIRATION || '24h',
    };
  }
}
