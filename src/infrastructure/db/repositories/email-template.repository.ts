import { EmailTemplateEntity } from 'src/infrastructure/db/entities/email-template.entity';
import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { EmailTemplateRepositoryInterface } from 'src/domain/repositories/email-template.repository.interface';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class EmailTemplateRepository
  implements EmailTemplateRepositoryInterface
{
  constructor(
    @InjectRepository(EmailTemplateEntity)
    private readonly emailTemplateRepository: Repository<EmailTemplateEntity>,
  ) {}
  async getTemplateByNameAndLocale(
    templateName: string,
    locale: string,
    fallBackLocale: string,
  ): Promise<EmailTemplateEntity> {
    const template = await this.emailTemplateRepository
      .createQueryBuilder('template')
      .innerJoinAndSelect('template.locales', 'locale')
      .where('template.name = :name ', {
        name: templateName,
      })
      .andWhere('locale.locale IN (:locale, :fallbackLocale)', {
        locale: locale,
        fallbackLocale: fallBackLocale,
      })
      .getOne();
    if (!template) {
      throw new NotFoundException(
        'Requested locale and fallback does not exists',
      );
    }
    return template;
  }
}
