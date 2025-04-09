import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto, RegisterResponseDto, LoginResponseDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload, AuthUser } from './types';
import { use } from 'passport';

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
          username: authDto.username,
          password: hash,
        },
      });
      const response: RegisterResponseDto = {
        id: user.id,
        username: user.username,
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

  async login(user: AuthUser): Promise<LoginResponseDto> {
    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
    };
    const access_token = await this.jwtService.signAsync(payload);
    const response: LoginResponseDto = { access_token };
    return response;
  }

  async validateUser(
    username: string,
    password: string,
  ): Promise<AuthUser | null> {
    const user = await this.prismaService.user.findUnique({
      where: { username },
    });
    if (!user) {
      return null;
    }
    const isMatch = await argon.verify(user.password, password);
    if (!isMatch) {
      throw null;
    }
    const validatedUser: AuthUser = {
      id: user.id,
      username: user.username,
    };
    return validatedUser;
  }
}
