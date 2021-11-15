import { NestFactory } from '@nestjs/core';
import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ErrorsInterceptor } from './handler/interceptors/errors.interceptor';
import { DatabaseModule } from './infrastructure/db/database.module';

async function bootstrap() {
  @Module({
    imports: [
      ConfigModule.forRoot({
        isGlobal: true,
      }),
      DatabaseModule,
      AppModule,
    ],
  })
  class Mdl {}
  const app = await NestFactory.create(Mdl);
  const configService = app.get(ConfigService);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new ErrorsInterceptor());
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Mailer')
    .setDescription('Mailer API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(configService.get('PORT') ?? 3000);
}
void bootstrap();
