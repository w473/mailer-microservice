import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TypeOrmHealthIndicator } from '@nestjs/terminus';
import * as Request from 'supertest';
import { testingModule } from './testing.module';
import { tokenAdminRole, tokenNoRole } from '../../../__mockdata__/jwt.tokens';
import { EmailTemplateService } from 'src/application/services/email-template.service';
import {
  emailTemplateDto,
  emailTemplateEntity,
} from '../../../__mockdata__/templates';
import { mock, mockReset } from 'jest-mock-extended';
import { NotFoundException } from 'src/domain/exceptions/not-found.exception';

describe('Templates', () => {
  let app: INestApplication;
  let request: Request.SuperTest<Request.Test>;
  const emailTemplateServiceMock = mock<EmailTemplateService>();

  beforeAll(async () => {
    const moduleRef = await testingModule
      .overrideProvider(TypeOrmHealthIndicator)
      .useValue({ pingCheck: () => null })
      .overrideProvider(EmailTemplateService)
      .useValue(emailTemplateServiceMock)

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
    mockReset(emailTemplateServiceMock);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Templates GET', () => {
    it(`/GET templates 403`, () => {
      return request.get('/templates').expect(403).expect({
        statusCode: 403,
        message: 'Forbidden resource',
        error: 'Forbidden',
      });
    });

    it(`/GET templates `, () => {
      emailTemplateServiceMock.findAllTemplates.mockResolvedValue([
        [emailTemplateEntity],
        1,
      ]);

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

    it(`/GET template not found`, () => {
      return request
        .get('/templates/666')
        .auth(tokenAdminRole, { type: 'bearer' })
        .expect(404)
        .expect({
          statusCode: 404,
          message: 'Template does not exist',
          error: 'Not Found',
        });
    });

    it(`/GET template found`, () => {
      emailTemplateServiceMock.getById.mockResolvedValue(emailTemplateEntity);

      return request
        .get('/templates/666')
        .auth(tokenAdminRole, { type: 'bearer' })
        .expect(200)
        .expect({
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
        });
    });
  });

  describe('Templates Add', () => {
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

    it(`POST (add) template 400 validation failed`, () => {
      return request
        .post('/templates')
        .auth(tokenAdminRole, { type: 'bearer' })
        .expect(400)
        .expect({
          statusCode: 400,
          message: [
            'name must be longer than or equal to 5 characters',
            'locales should not be empty',
          ],
          error: 'Bad Request',
        });
    });

    it(`POST (add) template OK`, () => {
      return request
        .post('/templates')
        .send(emailTemplateDto)
        .auth(tokenAdminRole, { type: 'bearer' })
        .expect(201)
        .expect({});
    });
  });

  describe('Templates Patch', () => {
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

    it(`PATCH Template Validation failed`, () => {
      return request
        .patch('/templates/666')
        .auth(tokenAdminRole, { type: 'bearer' })
        .expect(400)
        .expect({
          statusCode: 400,
          message: ['name must be longer than or equal to 5 characters'],
          error: 'Bad Request',
        });
    });

    it(`PATCH Template does not exist`, () => {
      return request
        .patch('/templates/666')
        .send({ name: 'kopytko' })
        .auth(tokenAdminRole, { type: 'bearer' })
        .expect(404)
        .expect({
          statusCode: 404,
          message: 'Template does not exists',
          error: 'Not Found',
        });
    });

    it(`PATCH Template OK`, () => {
      emailTemplateServiceMock.getById.mockResolvedValue(emailTemplateEntity);
      return request
        .patch('/templates/666')
        .send({ name: 'kopytko' })
        .auth(tokenAdminRole, { type: 'bearer' })
        .expect(200)
        .expect({});
    });
  });

  describe('PATCH locale', () => {
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
    it(`PATCH locale 404`, () => {
      return request
        .patch('/templates/666/locale')
        .send(emailTemplateDto.locales[0])
        .auth(tokenAdminRole, { type: 'bearer' })
        .expect(404)
        .expect({
          statusCode: 404,
          message: 'Template does not exists',
          error: 'Not Found',
        });
    });

    it(`PATCH locale 400 validation`, () => {
      return request
        .patch('/templates/666/locale')
        .auth(tokenAdminRole, { type: 'bearer' })
        .expect(400)
        .expect({
          statusCode: 400,
          message: [
            'locale must be locale',
            'subject must be longer than or equal to 5 characters',
            'contents must be longer than or equal to 50 characters',
          ],
          error: 'Bad Request',
        });
    });

    it(`PATCH locale OK`, () => {
      emailTemplateServiceMock.getById.mockResolvedValue(emailTemplateEntity);

      return request
        .patch('/templates/666/locale')
        .send(emailTemplateDto.locales[0])
        .auth(tokenAdminRole, { type: 'bearer' })
        .expect(200)
        .expect({});
    });
  });

  describe('Templates GET', () => {
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
    it(`DELETE template 404`, () => {
      return request
        .delete('/templates/666')
        .auth(tokenAdminRole, { type: 'bearer' })
        .expect(404)
        .expect({
          statusCode: 404,
          message: 'Template does not exists',
          error: 'Not Found',
        });
    });
    it(`DELETE template OK`, () => {
      emailTemplateServiceMock.getById.mockResolvedValue(emailTemplateEntity);
      return request
        .delete('/templates/666')
        .auth(tokenAdminRole, { type: 'bearer' })
        .expect(200)
        .expect({});
    });
  });

  describe('Templates GET', () => {
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

    it(`DELETE template locale 400`, () => {
      return request
        .delete('/templates/666/locale')
        .auth(tokenAdminRole, { type: 'bearer' })
        .expect(400)
        .expect({
          statusCode: 400,
          message: 'Validation failed (locale string is expected)',
          error: 'Bad Request',
        });
    });

    it(`DELETE template locale 404`, () => {
      return request
        .delete('/templates/666/de_DE')
        .auth(tokenAdminRole, { type: 'bearer' })
        .expect(404)
        .expect({
          statusCode: 404,
          message: 'Email template does not exists',
          error: 'Not Found',
        });
    });

    it(`DELETE template locale 404`, () => {
      emailTemplateServiceMock.getById.mockResolvedValue(emailTemplateEntity);
      emailTemplateServiceMock.deleteTemplateLocale.mockImplementation(() => {
        throw new NotFoundException('Template locale does not exists');
      });
      return request
        .delete('/templates/666/er_DE')
        .auth(tokenAdminRole, { type: 'bearer' })
        .expect(404)
        .expect({
          statusCode: 404,
          message: 'Template locale does not exists',
          error: 'Not Found',
        });
    });

    it(`DELETE template locale 500`, () => {
      emailTemplateServiceMock.getById.mockResolvedValue(emailTemplateEntity);
      emailTemplateServiceMock.deleteTemplateLocale.mockImplementation(() => {
        throw new Error();
      });
      return request
        .delete('/templates/666/er_DE')
        .auth(tokenAdminRole, { type: 'bearer' })
        .expect(500)
        .expect({ statusCode: 500, message: 'Internal server error' });
    });

    it(`DELETE template OK`, () => {
      emailTemplateServiceMock.getById.mockResolvedValue(emailTemplateEntity);
      return request
        .delete('/templates/666/pl_PL')
        .auth(tokenAdminRole, { type: 'bearer' })
        .expect(200)
        .expect({});
    });
  });
});
