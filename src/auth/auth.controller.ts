import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto, SignupDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  public signup(@Body() signupDto: SignupDto): Promise<string> {
    return this.authService.signup(signupDto);
  }

  @Post('signin')
  public signin(@Body() signinDto: SigninDto): Promise<string> {
    return this.authService.signin(signinDto);
  }
}
