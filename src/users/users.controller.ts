import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import { User } from 'src/auth/decorators';
import { JwtGuard } from 'src/auth/guards';
import { UsersService } from './users.service';
import { PatchUserDto, UserDto } from './dto';

@Controller('users')
@UseGuards(JwtGuard)
@SerializeOptions({ type: UserDto })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getMe(@User('id') userId: number): Promise<UserDto> {
    return this.usersService.getUser(userId);
  }

  @Patch('me')
  async patchMe(
    @User('id') userId: number,
    @Body() patchUserDto: PatchUserDto,
  ): Promise<UserDto> {
    return this.usersService.patchUser(userId, patchUserDto);
  }

  @Delete('me')
  async deleteMe(@User('id') userId): Promise<UserDto> {
    return this.usersService.deleteUser(userId);
  }
}
