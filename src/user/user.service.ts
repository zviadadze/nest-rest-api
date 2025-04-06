import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PatchUserDto, UserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async getUser(userId: number): Promise<UserDto> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new BadRequestException();
    }
    return new UserDto(user);
  }

  //   async patchUser(
  //     userId: number,
  //     patchUserDto: PatchUserDto,
  //   ): Promise<UserDto> {}

  //   async deleteUser(userId: number): Promise<UserDto> {}
}
