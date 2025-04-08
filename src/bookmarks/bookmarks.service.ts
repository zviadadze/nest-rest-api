import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateBookmarkDto, PatchBookmarkDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Bookmark } from '@prisma/client';

@Injectable()
export class BookmarksService {
  constructor(private readonly prismaService: PrismaService) {}

  async createBookmark(userId: number, createBookmarkDto: CreateBookmarkDto) {
    const newBookmark = await this.prismaService.bookmark.create({
      data: { userId, ...createBookmarkDto },
    });
    return newBookmark;
  }

  getBookmarks(userId: number) {
    return this.prismaService.bookmark.findMany({ where: { userId } });
  }

  getBookmark(userId: number, bookmarkId: number): Promise<Bookmark | null> {
    return this.prismaService.bookmark.findFirst({
      where: { userId, id: bookmarkId },
    });
  }

  async patchBookmark(
    userId: number,
    bookmarkId: number,
    patchBookmarkDto: PatchBookmarkDto,
  ) {
    const bookmarkToPatch = await this.prismaService.bookmark.findUnique({
      where: { id: bookmarkId },
    });
    if (!bookmarkToPatch || bookmarkToPatch.userId !== userId) {
      throw new ForbiddenException();
    }
    return this.prismaService.bookmark.update({
      where: { id: bookmarkId },
      data: { ...patchBookmarkDto },
    });
  }

  async deleteBookmark(userId: number, bookmarkId: number) {
    const bookmarkToDelete = await this.prismaService.bookmark.findUnique({
      where: { id: bookmarkId },
    });
    if (!bookmarkToDelete || bookmarkToDelete.userId !== userId) {
      throw new ForbiddenException();
    }
    return this.prismaService.bookmark.delete({
      where: { id: bookmarkId },
    });
  }
}
