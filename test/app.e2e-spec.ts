import {
  ClassSerializerInterceptor,
  ClassSerializerInterceptorOptions,
  HttpStatus,
  INestApplication,
  ValidationPipe,
  ValidationPipeOptions,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import * as pactum from 'pactum';
import { AuthDto } from 'src/auth/dto';
import { CreateBookmarkDto, PatchBookmarkDto } from 'src/bookmarks/dto';

describe('App e2e test', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const testingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = testingModule.createNestApplication();

    const vpOptitons: ValidationPipeOptions = {
      whitelist: true,
      forbidNonWhitelisted: true,
    };
    const vp = new ValidationPipe(vpOptitons);
    app.useGlobalPipes(vp);

    const reflector = app.get(Reflector);
    const csiOptions: ClassSerializerInterceptorOptions = {
      excludeExtraneousValues: true,
    };
    const csi = new ClassSerializerInterceptor(reflector, csiOptions);
    app.useGlobalInterceptors(csi);

    prismaService = app.get(PrismaService);
    await prismaService.cleanDb();

    pactum.request.setBaseUrl('http:/localhost:3333/');

    await app.init();
    await app.listen(3333);
  });

  afterAll(() => {
    app.close();
  });

  describe('auth', () => {
    const authDto: AuthDto = {
      username: 'test@test.com',
      password: 'test',
    };

    describe('POST register', () => {
      it('should register new user', () => {
        return pactum
          .spec()
          .post('auth/register')
          .withBody(authDto)
          .expectStatus(HttpStatus.CREATED);
      });

      it('should return forbidden when username taken', () => {
        return pactum
          .spec()
          .post('auth/register')
          .withBody(authDto)
          .expectStatus(HttpStatus.FORBIDDEN);
      });
    });

    describe('POST login', () => {
      it('should login', () => {
        return pactum
          .spec()
          .post('auth/login')
          .withBody(authDto)
          .expectStatus(HttpStatus.OK)
          .stores('access_token', 'access_token');
      });

      it('should return forbidden when password not valid', () => {
        return pactum
          .spec()
          .post('auth/login')
          .withBody({ username: 'test@test.com', password: 'invalid-password' })
          .expectStatus(HttpStatus.UNAUTHORIZED);
      });
    });
  });

  describe('users', () => {
    describe('GET me', () => {
      it('should return current user information', () => {
        return pactum
          .spec()
          .get('users/me')
          .withHeaders({
            Authorization: `Bearer $S{access_token}`,
          })
          .expectStatus(HttpStatus.OK);
      });

      it('should return unauthorized when access token not valid', () => {
        return pactum
          .spec()
          .get('users/me')
          .expectStatus(HttpStatus.UNAUTHORIZED);
      });

      it('should return unauthorized when access token not valid', () => {
        return pactum
          .spec()
          .get('users/me')
          .expectStatus(HttpStatus.UNAUTHORIZED);
      });

      it('should not contain password', async () => {
        const password = await pactum
          .spec()
          .get('users/me')
          .withHeaders({
            Authorization: `Bearer $S{access_token}`,
          })
          .expectStatus(HttpStatus.OK)
          .returns('password');
        expect(password).toBeUndefined();
      });
    });

    describe('PATCH me', () => {
      it('should patch current user information', () => {
        return pactum
          .spec()
          .patch('users/me')
          .withHeaders({
            Authorization: `Bearer $S{access_token}`,
          })
          .withBody({ lastName: 'Spontania' })
          .expectStatus(HttpStatus.OK)
          .expectJson('lastName', 'Spontania');
      });

      it('should return unauthorized when access token not valid', () => {
        return pactum
          .spec()
          .patch('users/me')
          .expectStatus(HttpStatus.UNAUTHORIZED);
      });

      it('should not contain password', async () => {
        const password = await pactum
          .spec()
          .patch('users/me')
          .withHeaders({
            Authorization: `Bearer $S{access_token}`,
          })
          .expectStatus(HttpStatus.OK)
          .returns('password');
        expect(password).toBeUndefined();
      });
    });
  });

  describe('bookmarks', () => {
    describe('GET bookmarks', () => {
      it('should get empty bookmarks array', () => {
        return pactum
          .spec()
          .get('bookmarks')
          .withHeaders({ Authorization: 'Bearer $S{access_token}' })
          .expectStatus(HttpStatus.OK)
          .expectJsonLength(0);
      });
    });

    describe('POST bookmarks', () => {
      const createBookmarkDto: CreateBookmarkDto = {
        title: 'Google Translate',
        link: 'https://translate.google.com',
      };

      it('should create bookmark', () => {
        return pactum
          .spec()
          .post('bookmarks')
          .withHeaders({ Authorization: 'Bearer $S{access_token}' })
          .withBody(createBookmarkDto)
          .expectStatus(HttpStatus.CREATED)
          .stores('bookmarkId', 'id');
      });
    });

    describe('GET bookmarks', () => {
      it('should get bookmarks array', () => {
        return pactum
          .spec()
          .get('bookmarks')
          .withHeaders({ Authorization: 'Bearer $S{access_token}' })
          .expectStatus(HttpStatus.OK)
          .expectJsonLength(1);
      });
    });

    describe('GET bookmarks/:id', () => {
      it('should get bookmark', () => {
        return pactum
          .spec()
          .get('bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({ Authorization: 'Bearer $S{access_token}' })
          .expectStatus(HttpStatus.OK)
          .expectJson('id', '$S{bookmarkId}');
      });
    });

    describe('PATCH bookmarks/:id', () => {
      const description = 'Google Translate Description';
      const patchBookmarkDto: PatchBookmarkDto = {
        description,
      };

      it('should patch bookmark', () => {
        return pactum
          .spec()
          .patch('bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({ Authorization: 'Bearer $S{access_token}' })
          .withBody(patchBookmarkDto)
          .expectStatus(HttpStatus.OK)
          .expectJson('description', description);
      });
    });

    describe('DELETE bookmarks/:id', () => {
      it('should delete bookmark', () => {
        return pactum
          .spec()
          .delete('bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({ Authorization: 'Bearer $S{access_token}' })
          .expectStatus(HttpStatus.NO_CONTENT);
      });

      it('should get empty bookmarks array', () => {
        return pactum
          .spec()
          .get('bookmarks')
          .withHeaders({ Authorization: 'Bearer $S{access_token}' })
          .expectStatus(HttpStatus.OK)
          .expectJsonLength(0);
      });
    });
  });
});
