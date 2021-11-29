import { AuthorizationGuard } from 'src/handler/auth/authorization.guard';
import { Reflector } from '@nestjs/core';
import { mock, mockReset } from 'jest-mock-extended';
import { ExecutionContext } from '@nestjs/common/interfaces/features/execution-context.interface';
import { HttpArgumentsHost } from '@nestjs/common/interfaces/features/arguments-host.interface';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

describe('AuthorizationGuard test', () => {
  let authGuard: AuthorizationGuard;
  const reflectorMock = mock<Reflector>();
  const configServiceMock = mock<ConfigService>();

  beforeEach(async () => {
    authGuard = new AuthorizationGuard(reflectorMock, configServiceMock);
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
