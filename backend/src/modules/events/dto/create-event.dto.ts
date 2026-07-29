import { IsString, IsOptional, IsBoolean, IsDateString } from 'class-validator';

export class CreateEventDto {
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsDateString()
  eventDate!: string;

  @IsOptional()
  @IsString()
  eventTime?: string;

  @IsOptional()
  @IsString()
  registrationLink?: string;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
