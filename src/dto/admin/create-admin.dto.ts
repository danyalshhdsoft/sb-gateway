import { IsMongoId, IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from "class-validator";

export class CreateAdminDto {
    @IsString()
    @IsNotEmpty({ message: 'email is required' })
    email: string;
  
    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    firstName: string;

    @IsString()
    lastName: string;

    @IsPhoneNumber()
    @IsString()
    phone: string;

    @IsMongoId()
    @IsOptional()
    role?: string; // Role ID
  }