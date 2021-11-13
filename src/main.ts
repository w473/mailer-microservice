import { NestFactory } from '@nestjs/core';
import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ErrorsInterceptor } from './handler/interceptors/errors.interceptor';
import { DatabaseModule } from './infrastructure/db/database.module';
import { RolesGuard } from './handler/auth/roles.guard';

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
  app.useGlobalGuards(new RolesGuard());
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Mailer')
    .setDescription('Mailer API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(configService.get('PORT') ?? 3000);
}
void bootstrap();
