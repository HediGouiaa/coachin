import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateAvailabilityDto {
  @IsString()
  startTime!: string; // "09:00"

  @IsString()
  endTime!: string; // "17:00"

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}
