import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const header =
      (req.headers['x-api-key'] as string | undefined) ||
      (req.headers['X-API-KEY'] as string | undefined);
    const expected = process.env.API_KEY || 'test-key';
    return header === expected;
  }
}
