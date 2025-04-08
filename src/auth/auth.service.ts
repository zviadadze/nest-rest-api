import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto, RegisterResponseDto, LoginResponseDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './types';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}
  async register(authDto: AuthDto): Promise<RegisterResponseDto> {
    try {
      const hash = await argon.hash(authDto.password);
      const user = await this.prismaService.user.create({
        data: {
          email: authDto.email,
          password: hash,
        },
      });
      const response: RegisterResponseDto = {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
      };
      return response;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ForbiddenException();
      }
      throw error;
    }
  }

  async login(authDto: AuthDto): Promise<LoginResponseDto> {
    const user = await this.prismaService.user.findUnique({
      where: { email: authDto.email },
    });
    if (!user) {
      throw new ForbiddenException();
    }
    const isMatch = await argon.verify(user.password, authDto.password);
    if (!isMatch) {
      throw new ForbiddenException();
    }
    const payload: JwtPayload = {
      sub: user.id,
    };
    const accessToken = await this.jwtService.signAsync(payload);
    const response: LoginResponseDto = { accessToken };
    return response;
  }
}
