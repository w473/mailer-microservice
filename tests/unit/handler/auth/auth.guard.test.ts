import { AuthGuard } from 'src/handler/auth/auth.guard';
import { Reflector } from '@nestjs/core';
import { mock, mockReset } from 'jest-mock-extended';
import { ExecutionContext } from '@nestjs/common/interfaces/features/execution-context.interface';
import { HttpArgumentsHost } from '@nestjs/common/interfaces/features/arguments-host.interface';
import { Request } from 'express';

describe('AuthGuard test', () => {
  let authGuard: AuthGuard;
  const reflectorMock = mock<Reflector>();

  beforeEach(async () => {
    authGuard = new AuthGuard(reflectorMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
    mockReset(reflectorMock);
  });

  describe('error', () => {
    it('will return false', async () => {
      const context = mock<ExecutionContext>();
      const httpArgumentsHost = mock<HttpArgumentsHost>();
      const request = mock<Request>();
      request.header.mockImplementation(() => {
        throw new Error();
      });
      httpArgumentsHost.getRequest.mockReturnValue(request);
      context.switchToHttp.mockReturnValue(httpArgumentsHost);
      reflectorMock.get.mockReturnValue(false);
      expect(authGuard.canActivate(context)).toEqual(false);
    });
  });
});
