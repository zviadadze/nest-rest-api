import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, RegisterResponseDto, LoginResponseDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() authDto: AuthDto): Promise<RegisterResponseDto> {
    return this.authService.register(authDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() authDto: AuthDto): Promise<LoginResponseDto> {
    return this.authService.login(authDto);
  }
}
