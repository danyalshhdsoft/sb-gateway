import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class RegisterAgencyRequestDto {
    @IsEmail()
    @IsNotEmpty({ message: 'email is required' })
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

    @IsString()
    @IsOptional()
    companyName?: string;
  
    @IsString()
    @IsOptional()
    phone?: string;
  }