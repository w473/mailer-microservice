import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerMiddleware } from './handler/middlewares/logger.middleware';
import { JwtStrategy } from './handler/auth/jwt.strategy';
import { HealthController } from './handler/controllers/health.controller';
import { EmailEntity } from './infrastructure/db/entities/email.entity';
import { EmailRecipientEntity } from './infrastructure/db/entities/email-recipient.entity';
import { EmailTemplateEntity } from './infrastructure/db/entities/email-template.entity';
import { EmailTemplateLocaleEntity } from './infrastructure/db/entities/email-template-locale.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EmailEntity,
      EmailRecipientEntity,
      EmailTemplateEntity,
      EmailTemplateLocaleEntity,
    ]),
    PassportModule,
    TerminusModule,
    HttpModule,
  ],
  controllers: [HealthController],
  providers: [JwtStrategy],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
