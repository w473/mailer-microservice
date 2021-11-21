import { INestApplication } from '@nestjs/common';
import { TypeOrmHealthIndicator } from '@nestjs/terminus';
import * as Request from 'supertest';
import { testingModule } from './testing.module';

describe('HEALTH', () => {
  let app: INestApplication;
  let request: Request.SuperTest<Request.Test>;

  beforeAll(async () => {
    const moduleRef = await testingModule
      .overrideProvider(TypeOrmHealthIndicator)
      .useValue({ pingCheck: () => null })
      .compile();

    app = await moduleRef.createNestApplication();
    await app.init();
  });

  beforeEach(() => {
    request = Request(app.getHttpServer());
  });

  // afterAll(async () => {
  //   await app.close();
  // });

  it(`/GET health`, () => {
    return request
      .get('/health')
      .expect(200)
      .expect({ status: 'ok', info: {}, error: {}, details: {} });
  });
});
