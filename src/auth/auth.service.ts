import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SigninDto, SignupDto } from './dto';
import * as argon from 'argon2';
import { dot } from 'node:test/reporters';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  public async signup(signupDto: SignupDto): Promise<string> {
    try {
      const hash = await argon.hash(signupDto.password);
      await this.prismaService.user.create({
        data: {
          email: signupDto.email,
          hash,
        },
      });
      return 'Success';
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ForbiddenException('Credentials taken');
      }
      throw error;
    }
  }

  public async signin(signinDto: SigninDto): Promise<string> {
    const user = await this.prismaService.user.findUnique({
      where: { email: signinDto.email },
    });
    if (!user) {
      throw new ForbiddenException('Credentials incorrect');
    }
    const isMatch = await argon.verify(user.hash, signinDto.password);
    if (!isMatch) {
      throw new ForbiddenException('Credentials incorrect');
    }
    return 'Success';
  }
}
