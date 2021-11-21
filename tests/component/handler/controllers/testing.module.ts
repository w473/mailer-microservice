import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { AppModule } from 'src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EmailRecipientEntity } from 'src/infrastructure/db/entities/email-recipient.entity';
import { EmailEntity } from 'src/infrastructure/db/entities/email.entity';
import { EmailTemplateEntity } from 'src/infrastructure/db/entities/email-template.entity';
import { EmailTemplateLocaleEntity } from 'src/infrastructure/db/entities/email-template-locale.entity';

export const testingModule = Test.createTestingModule({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    AppModule,
  ],
})

  .overrideProvider(getRepositoryToken(EmailRecipientEntity))
  .useValue({})
  .overrideProvider(getRepositoryToken(EmailEntity))
  .useValue({})
  .overrideProvider(getRepositoryToken(EmailTemplateEntity))
  .useValue({})
  .overrideProvider(getRepositoryToken(EmailTemplateLocaleEntity))
  .useValue({});
