import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from "class-validator";

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

export class CreateAgencyRequestDto {
    @IsEmail()
    @IsNotEmpty({ message: 'email is required' })
    email: string;

    @IsString()
    firstName: string;

    @IsString()
    lastName: string;

    @IsString()
    password: string;

    @IsString()
    companyName: string;

    @IsPhoneNumber()
    @IsString()
    phone: string;
}
