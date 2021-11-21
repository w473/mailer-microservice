import { Reflector } from '@nestjs/core';
import { mock, mockReset } from 'jest-mock-extended';
import { ExecutionContext } from '@nestjs/common/interfaces/features/execution-context.interface';
import { HttpArgumentsHost } from '@nestjs/common/interfaces/features/arguments-host.interface';
import { Request } from 'express';
import { RolesGuard } from 'src/handler/auth/roles.guard';
import { User } from 'src/handler/auth/models/user';

describe('RolesGuard test', () => {
  let rolesGuard: RolesGuard;
  const reflectorMock = mock<Reflector>();

  beforeEach(async () => {
    rolesGuard = new RolesGuard(reflectorMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
    mockReset(reflectorMock);
  });

  it('will return true no required roles', async () => {
    const context = mock<ExecutionContext>();
    const httpArgumentsHost = mock<HttpArgumentsHost>();
    const request = mock<Request & { user: User }>();
    request.user = new User();
    httpArgumentsHost.getRequest.mockReturnValue(request);
    context.switchToHttp.mockReturnValue(httpArgumentsHost);
    reflectorMock.get.mockReturnValueOnce(false).mockReturnValueOnce([]);
    expect(rolesGuard.canActivate(context)).toEqual(true);
  });

  it('will return false no user', async () => {
    const context = mock<ExecutionContext>();
    const httpArgumentsHost = mock<HttpArgumentsHost>();
    const request = mock<Request>();
    httpArgumentsHost.getRequest.mockReturnValue(request);
    context.switchToHttp.mockReturnValue(httpArgumentsHost);
    reflectorMock.get.mockReturnValueOnce(false).mockReturnValueOnce(['ADMIN']);
    expect(rolesGuard.canActivate(context)).toEqual(false);
  });
});
