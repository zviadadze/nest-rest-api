import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class RegisterResponseDto {
  id: number;
  email: string;
  createdAt: Date;
}

export class LoginResponseDto {
  accessToken: string;
}
