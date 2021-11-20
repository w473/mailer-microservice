import { EmailTemplateEntity } from 'src/infrastructure/db/entities/email-template.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailTemplateLocaleEntity } from 'src/infrastructure/db/entities/email-template-locale.entity';
import { EmailTemplateLocaleRepositoryInterface } from 'src/domain/repositories/email-template-locale.repository.interface';

@Injectable()
export class EmailTemplateLocaleRepository
  implements EmailTemplateLocaleRepositoryInterface
{
  constructor(
    @InjectRepository(EmailTemplateLocaleEntity)
    private readonly emailTemplateLocaleRepository: Repository<EmailTemplateLocaleEntity>,
  ) {}

  async save(
    emailTemplateLocaleEntity: EmailTemplateLocaleEntity,
  ): Promise<EmailTemplateEntity> {
    return this.emailTemplateLocaleRepository.save(emailTemplateLocaleEntity);
  }

  async remove(
    emailTemplateLocaleEntity: EmailTemplateLocaleEntity,
  ): Promise<void> {
    await this.emailTemplateLocaleRepository.remove(emailTemplateLocaleEntity);
  }
}
