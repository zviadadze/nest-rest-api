import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { UserService } from './user.service';
import { PatchUserDto, UserDto } from './dto';

@Controller('users')
@UseGuards(JwtGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async getMe(@CurrentUser('id') userId: number): Promise<UserDto> {
    return this.userService.getUser(userId);
  }

  // @Patch('me')
  // async patchMe(
  //   @CurrentUser('id') userId: number,
  //   @Body() patchUserDto: PatchUserDto,
  // ): Promise<UserDto> {
  //   return this.userService.patchUser(userId, patchUserDto);
  // }

  // @Delete('me')
  // async deleteMe(@CurrentUser('id') userId): Promise<UserDto> {
  //   return this.userService.deleteUser(userId);
  // }
}
