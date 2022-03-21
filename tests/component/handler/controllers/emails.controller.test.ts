import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TypeOrmHealthIndicator } from '@nestjs/terminus';
import * as Request from 'supertest';
import { testingModule } from './testing.module';
import { tokenAdminRole, tokenNoRole } from '../../../__mockdata__/jwt.tokens';
import { emailEntity, emailSendRequestDto } from '../../../__mockdata__/emails';
import { EmailService } from 'src/application/services/email.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EmailRecipientEntity } from 'src/infrastructure/db/entities/email-recipient.entity';
import { DEFAULT_AUTHORIZATION_HEADER } from 'src/statics';

describe('Emails', () => {
  const basicPath = '/api/v1/emails';
  let app: INestApplication;
  let request: Request.SuperTest<Request.Test>;
  const emailServiceMock = {
    findAllBy: jest.fn(),
    send: jest.fn(),
  };

  beforeAll(async () => {
    const moduleRef = await testingModule
      .overrideProvider(TypeOrmHealthIndicator)
      .useValue({ pingCheck: () => null })
      .overrideProvider(EmailService)
      .useValue(emailServiceMock)
      .compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    );
    await app.init();
  });

  beforeEach(() => {
    request = Request(app.getHttpServer());
  });

  afterAll(async () => {
    await app.close();
  });

  it(`/GET emails`, () => {
    emailServiceMock.findAllBy = jest.fn().mockReturnValue([[emailEntity], 1]);

    return request
      .get(basicPath + '/')
      .set(DEFAULT_AUTHORIZATION_HEADER, tokenAdminRole)
      .expect(200)
      .expect({
        items: [
          {
            id: 123,
            subject: 'some Subject pott',
            contents: 'some Contents',
            recipients: [
              {
                userId: '5ebd704d-28a9-4dcc-8fa3-c350137aab38',
                email: 'some@email.de',
                name: 'tomato',
              },
            ],
            sent: null,
          },
        ],
        total: 1,
      });
  });

  it(`/GET emails with email_id`, () => {
    emailServiceMock.findAllBy = jest.fn().mockReturnValue([[emailEntity], 1]);

    return request
      .get(basicPath + '/?email_id=666')
      .set(DEFAULT_AUTHORIZATION_HEADER, tokenAdminRole)
      .expect(200)
      .expect({
        items: [
          {
            id: 123,
            subject: 'some Subject pott',
            contents: 'some Contents',
            recipients: [
              {
                userId: '5ebd704d-28a9-4dcc-8fa3-c350137aab38',
                email: 'some@email.de',
                name: 'tomato',
              },
            ],
            sent: null,
          },
        ],
        total: 1,
      });
  });

  it(`/Post send email validation failed`, () => {
    return request
      .post(basicPath + '/')
      .set(DEFAULT_AUTHORIZATION_HEADER, tokenAdminRole)
      .expect(400)
      .expect({
        statusCode: 400,
        message: [
          'templateName must be a string',
          'templateName must be longer than or equal to 5 characters',
          'locale must be locale',
        ],
        error: 'Bad Request',
      });
  });

  it(`/Post send email ok`, () => {
    return request
      .post(basicPath + '/')
      .send(emailSendRequestDto)
      .set(DEFAULT_AUTHORIZATION_HEADER, tokenAdminRole)
      .expect(201)
      .expect({});
  });
});
