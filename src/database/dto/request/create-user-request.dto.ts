import { IsEmail, IsString, MinLength, IsPhoneNumber, IsISO31661Alpha2 } from "class-validator";

export class CreateUserRequestDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @MinLength(8)
  confirmPassword: string;

  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  address: string;

  @IsString()
  @IsPhoneNumber()
  phone: string;

  @IsString()
  @IsISO31661Alpha2() 
  country: string;

  @IsString()
  city: string;
}