import { IsOptional, IsString, IsInt, IsEmail } from 'class-validator';

export class UpdateCoachDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  whatsappNumber?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  photoUrl?: string;

  @IsOptional()
  @IsString()
  expertise?: string;

  @IsOptional()
  @IsInt()
  yearsOfExperience?: number;

  @IsOptional()
  @IsString()
  certifications?: string;

  @IsOptional()
  socialMedia?: any;

  @IsOptional()
  @IsInt()
  sessionDurationMinutes?: number;

  @IsOptional()
  @IsInt()
  sessionBufferMinutes?: number;
}
