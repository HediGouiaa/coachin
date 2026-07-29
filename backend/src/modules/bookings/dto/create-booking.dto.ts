import { IsString, IsEmail, IsOptional, IsDateString } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  clientName!: string;

  @IsEmail()
  clientEmail!: string;

  @IsString()
  clientPhone!: string;

  @IsString()
  subject!: string;

  @IsOptional()
  @IsString()
  clientMessage?: string;

  @IsDateString()
  sessionDate!: string; // ISO 8601 format

  @IsString()
  sessionStartTime!: string; // "09:00" format
}
