import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { LoggerMiddleware } from './handler/middlewares/logger.middleware';
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
import { AuthGuard } from 'src/handler/auth/auth.guard';

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
  ],
  controllers: [HealthController, EmailsController, TemplatesController],
  providers: [
    EmailService,
    EmailTemplateService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
