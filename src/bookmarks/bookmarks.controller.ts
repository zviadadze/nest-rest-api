import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards';
import { BookmarksService } from './bookmarks.service';
import { User } from 'src/auth/decorators';
import { CreateBookmarkDto, PatchBookmarkDto } from './dto';
import { Bookmark } from '@prisma/client';

@Controller('bookmarks')
@UseGuards(JwtGuard)
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createBookmark(
    @User('id') userId: number,
    @Body() createBookmarkDto: CreateBookmarkDto,
  ) {
    return this.bookmarksService.createBookmark(userId, createBookmarkDto);
  }

  @Get()
  getBookmarks(@User('id') userId: number) {
    return this.bookmarksService.getBookmarks(userId);
  }

  @Get(':id')
  getBookmark(
    @User('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ): Promise<Bookmark | null> {
    return this.bookmarksService.getBookmark(userId, bookmarkId);
  }

  @Patch(':id')
  patchBookmark(
    @User('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
    @Body() patchBookmarkDto: PatchBookmarkDto,
  ) {
    return this.bookmarksService.patchBookmark(
      userId,
      bookmarkId,
      patchBookmarkDto,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteBookmark(
    @User('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    return this.bookmarksService.deleteBookmark(userId, bookmarkId);
  }
}
