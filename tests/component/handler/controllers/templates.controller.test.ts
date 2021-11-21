import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TypeOrmHealthIndicator } from '@nestjs/terminus';
import * as Request from 'supertest';
import { testingModule } from './testing.module';
import { tokenAdminRole, tokenNoRole } from '../../../__mockdata__/jwt.tokens';
import { emailEntity, emailSendRequestDto } from '../../../__mockdata__/emails';
import { EmailService } from 'src/application/services/email.service';
import { EmailTemplateService } from 'src/application/services/email-template.service';
import { emailTemplateEntity } from '../../../__mockdata__/templates';

describe('Templates', () => {
  let app: INestApplication;
  let request: Request.SuperTest<Request.Test>;
  const emailTemplateServiceMock = {
    findAllTemplates: jest.fn(),
  };

  beforeAll(async () => {
    const moduleRef = await testingModule
      .overrideProvider(TypeOrmHealthIndicator)
      .useValue({ pingCheck: () => null })
      .overrideProvider(EmailTemplateService)
      .useValue(emailTemplateServiceMock)

      .compile();

    app = await moduleRef.createNestApplication();
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

  // afterAll(async () => {
  //   await app.close();
  // });

  it(`/GET templates 403`, () => {
    return request.get('/templates').expect(403).expect({
      statusCode: 403,
      message: 'Forbidden resource',
      error: 'Forbidden',
    });
  });

  it(`/GET templates `, () => {
    emailTemplateServiceMock.findAllTemplates = jest
      .fn()
      .mockReturnValue([[emailTemplateEntity], 1]);
    return request
      .get('/templates')
      .auth(tokenAdminRole, { type: 'bearer' })
      .expect(200)
      .expect({
        items: [
          {
            id: 666,
            name: 'potato',
            locales: [
              {
                subject: 'some Subject {{variableUno}}',
                contents: 'some Contents',
                locale: 'pl_PL',
              },
              {
                subject: 'some eeee {{variableUno}}',
                contents: 'some uuu',
                locale: 'en_US',
              },
            ],
          },
        ],
        total: 1,
      });
  });

  it(`/GET template 403`, () => {
    return request
      .get('/templates/666')
      .auth(tokenNoRole, { type: 'bearer' })
      .expect(403)
      .expect({
        statusCode: 403,
        message: 'Forbidden resource',
        error: 'Forbidden',
      });
  });

  it(`POST (add) template 403`, () => {
    return request
      .post('/templates')
      .auth(tokenNoRole, { type: 'bearer' })
      .expect(403)
      .expect({
        statusCode: 403,
        message: 'Forbidden resource',
        error: 'Forbidden',
      });
  });

  it(`PATCH template 403`, () => {
    return request
      .patch('/templates/666')
      .auth(tokenNoRole, { type: 'bearer' })
      .expect(403)
      .expect({
        statusCode: 403,
        message: 'Forbidden resource',
        error: 'Forbidden',
      });
  });

  it(`PATCH locale 403`, () => {
    return request
      .patch('/templates/666/locale')
      .auth(tokenNoRole, { type: 'bearer' })
      .expect(403)
      .expect({
        statusCode: 403,
        message: 'Forbidden resource',
        error: 'Forbidden',
      });
  });

  it(`DELETE template 403`, () => {
    return request
      .delete('/templates/666')
      .auth(tokenNoRole, { type: 'bearer' })
      .expect(403)
      .expect({
        statusCode: 403,
        message: 'Forbidden resource',
        error: 'Forbidden',
      });
  });

  it(`DELETE template locale 403`, () => {
    return request
      .delete('/templates/666/locale')
      .auth(tokenNoRole, { type: 'bearer' })
      .expect(403)
      .expect({
        statusCode: 403,
        message: 'Forbidden resource',
        error: 'Forbidden',
      });
  });
});
