import { Type } from 'class-transformer';

import {
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsString,
  Validate,
  IsOptional,
  Length,
  Matches,
  MaxLength,
  MinLength,
  IsArray,
  ValidateNested,
  IsEnum,
  ArrayNotEmpty,
  IsBoolean,
} from 'class-validator';

import mongoose from 'mongoose';

export class RegisterUserDto {
  @IsString()
  @Matches(/^[a-z0-9.+_-]+$/)
  @Length(1, 150)
  username: string;

  @IsString()
  @Length(1, 128)
  password: string;

  @IsEmail()
  @Length(1, 150)
  email: string;
}

export class AdminSigninDto {
  @IsString()
  @IsNotEmpty({ message: 'email is required' })
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class AdminSignupDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsBoolean()
  @IsOptional()
  isSuperAdmin?: boolean;

  @IsMongoId()
  @IsOptional()
  role?: string; // Role ID
}

export class ResetPasswordRequestDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  @Validate((value, args) => value === args.object.password)
  confirmPassword: string;
}

export class VerifyEmailDto {
  @IsString()
  @IsNotEmpty()
  otp: string;
}

export class ForgotPasswordRequestDto {
  email: any;
}

// reset-password.dto.ts
export class ForgotPasswordDto {
  token: string;
  newPassword: string;
  confirmPassword:string
}
