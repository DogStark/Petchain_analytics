import { 
  IsString, 
  IsNotEmpty, 
  IsOptional, 
  IsNumber, 
  IsObject, 
  IsEnum, 
  Min, 
  Max, 
  Length, 
  Matches, 
  IsDateString,
  ValidateNested,
  IsArray,
  ArrayMaxSize,
  IsNumberString
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { IsSafeString } from '../validators/safe-string.validator';
import { IsValidDateRange } from '../validators/custom-date.validator';

export enum EventType {
  PAGE_VIEW = 'page_view',
  CLICK = 'click',
  FORM_SUBMIT = 'form_submit',
  CUSTOM = 'custom'
}

export class EventPropertiesDto {
  @IsOptional()
  @IsString()
  @Length(1, 100)
  @IsSafeString()
  page?: string;

  @IsOptional()
  @IsString()
  @Length(1, 200)
  @IsSafeString()
  url?: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  @IsSafeString()
  element?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10000)
  duration?: number;

  @IsOptional()
  @IsObject()
  customData?: Record<string, any>;
}

export class CreateAnalyticsEventDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  @IsSafeString()
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message: 'Event name must contain only alphanumeric characters, hyphens, and underscores'
  })
  eventName: string;

  @IsEnum(EventType)
  eventType: EventType;

  @IsOptional()
  @IsDateString()
  @IsValidDateRange()
  timestamp?: string;

  @IsString()
  @IsNotEmpty()
  @Length(10, 200)
  @IsSafeString()
  @Matches(/^[a-zA-Z0-9_-]+$/)
  sessionId: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  @IsSafeString()
  userId?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => EventPropertiesDto)
  properties?: EventPropertiesDto;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  @IsSafeString()
  @Matches(/^[a-zA-Z0-9.-]+$/)
  userAgent?: string;

  @IsOptional()
  @IsString()
  @Length(7, 45) // IPv4: 7-15 chars, IPv6: up to 45 chars
  @Matches(/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$|^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/)
  ipAddress?: string;

  @Transform(({ value }) => parseInt(value, 10))
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(999999999)
  revenue?: number;
}