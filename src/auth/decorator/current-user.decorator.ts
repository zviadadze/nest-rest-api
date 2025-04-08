import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthUser } from '../type';

export const CurrentUser = createParamDecorator(
  (
    key: keyof AuthUser | undefined,
    ctx: ExecutionContext,
  ): AuthUser[keyof AuthUser] | AuthUser => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return key ? user?.[key] : user;
  },
);
