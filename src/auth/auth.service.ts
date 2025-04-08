import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto, RegisterResponseDto, LoginResponseDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './types';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async register(authDto: AuthDto): Promise<RegisterResponseDto> {
    try {
      const hash = await argon.hash(authDto.password);
      const user = await this.prismaService.user.create({
        data: {
          email: authDto.email,
          password: hash,
        },
      });
      const response = {
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
        throw new ForbiddenException('Credentials taken');
      }
      throw error;
    }
  }

  public async login(authDto: AuthDto): Promise<LoginResponseDto> {
    const user = await this.prismaService.user.findUnique({
      where: { email: authDto.email },
    });
    if (!user) {
      throw new ForbiddenException('Credentials incorrect');
    }
    const isMatch = await argon.verify(user.password, authDto.password);
    if (!isMatch) {
      throw new ForbiddenException('Credentials incorrect');
    }
    const accessToken = await this.signToken(user.id);
    const response = { accessToken };
    return response;
  }

  private async signToken(userId: number): Promise<string> {
    const payload: JwtPayload = {
      sub: userId,
    };
    const options: JwtSignOptions = {
      expiresIn: '15m',
      secret: this.configService.get('JWT_SECRET'),
    };
    const accessToken = await this.jwtService.signAsync(payload, options);
    return accessToken;
  }
}
