import { RoleNames } from '@/config/role-names.enum';
import {
  IsEmail,
  IsNotEmpty,
  IsUUID,
  IsOptional,
  IsNumber,
} from 'class-validator';

export class PayloadDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsUUID()
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  role: string;

  @IsOptional()
  @IsNumber()
  iat?: number;

  @IsOptional()
  @IsNumber()
  exp?: number;
}
