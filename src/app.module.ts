import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { HealthController } from './handler/controllers/health.controller';
import { EmailEntity } from './infrastructure/db/entities/email.entity';
import { EmailRecipientEntity } from './infrastructure/db/entities/email-recipient.entity';
import { EmailTemplateEntity } from './infrastructure/db/entities/email-template.entity';
import { EmailTemplateLocaleEntity } from './infrastructure/db/entities/email-template-locale.entity';
import { RolesGuard } from './handler/auth/roles.guard';
import { EmailsController } from 'src/handler/controllers/emails.controller';
import { TemplatesController } from 'src/handler/controllers/templates.controller';
import { EmailService } from 'src/application/services/email.service';
import { EmailTemplateService } from 'src/application/services/email-template.service';
import { AuthorizationGuard } from 'src/handler/auth/authorization.guard';
import { ConfigService } from '@nestjs/config';
import { EmailQueueConsumer } from 'src/handler/consumers/email-queue.consumer';
import {
  EMAIL_TRANSPORTER,
  EmailSendService,
} from 'src/application/services/email-send.service';
import { createTransport } from 'nodemailer';
import { EmailTemplateRepository } from 'src/infrastructure/db/repositories/email-template.repository';
import { EmailRepository } from 'src/infrastructure/db/repositories/email.repository';
import { EmailTemplateLocaleRepository } from 'src/infrastructure/db/repositories/email-template-locale.repository';
import { BullModule } from '@nestjs/bull';
import { LoggerMiddleware } from 'src/infrastructure/middlewares/logger.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EmailEntity,
      EmailRecipientEntity,
      EmailTemplateEntity,
      EmailTemplateLocaleEntity,
    ]),
    TerminusModule,
    HttpModule,
    BullModule.forRootAsync({
      imports: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST'),
          password: configService.get('REDIS_PASSWORD'),
          port: 6379,
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueueAsync({
      name: 'emails',
    }),
  ],
  controllers: [HealthController, EmailsController, TemplatesController],
  providers: [
    EmailService,
    EmailTemplateService,
    EmailQueueConsumer,
    EmailSendService,
    {
      provide: APP_GUARD,
      useClass: AuthorizationGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: EMAIL_TRANSPORTER,
      useFactory: (configService: ConfigService) => {
        return createTransport({
          host: configService.get('EMAIL_SERVICE_HOST'),
          port: Number.parseInt(configService.get('EMAIL_SERVICE_PORT'), 10),
          secure: configService.get('EMAIL_SERVICE_PORT') === '465',
          auth: {
            user: configService.get('EMAIL_SERVICE_USER'),
            pass: configService.get('EMAIL_SERVICE_PASS'),
          },
        });
      },
      inject: [ConfigService],
    },
    {
      provide: 'EmailRepositoryInterface',
      useClass: EmailRepository,
    },
    {
      provide: 'EmailTemplateRepositoryInterface',
      useClass: EmailTemplateRepository,
    },
    {
      provide: 'EmailTemplateLocaleRepositoryInterface',
      useClass: EmailTemplateLocaleRepository,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
