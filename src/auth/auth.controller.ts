import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  RegisterDto,
  RegisterResponseDto,
  LoginDto,
  LoginResponseDto,
} from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() signupDto: RegisterDto): Promise<RegisterResponseDto> {
    return this.authService.register(signupDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() signinDto: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(signinDto);
  }
}
