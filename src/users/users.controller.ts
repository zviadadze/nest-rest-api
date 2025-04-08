import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators';
import { JwtGuard } from 'src/auth/guards';
import { UsersService } from './users.service';
import { PatchUserDto, UserDto } from './dto';

@Controller('users')
@UseGuards(JwtGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getMe(@CurrentUser('id') userId: number): Promise<UserDto> {
    return this.usersService.getUser(userId);
  }

  @Patch('me')
  async patchMe(
    @CurrentUser('id') userId: number,
    @Body() patchUserDto: PatchUserDto,
  ): Promise<UserDto> {
    return this.usersService.patchUser(userId, patchUserDto);
  }

  // @Delete('me')
  // async deleteMe(@CurrentUser('id') userId): Promise<UserDto> {
  //   return this.usersService.deleteUser(userId);
  // }
}
