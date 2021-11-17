import { EmailTemplateEntity } from 'src/infrastructure/db/entities/email-template.entity';
import { EntityRepository, Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { EmailTemplateRepositoryInterface } from 'src/domain/repositories/email-template.repository.interface';

@EntityRepository(EmailTemplateEntity)
export class EmailTemplateRepository
  extends Repository<EmailTemplateEntity>
  implements EmailTemplateRepositoryInterface
{
  async getTemplateByNameAndLocale(
    templateName: string,
    locale: string,
    fallBackLocale: string,
  ): Promise<EmailTemplateEntity> {
    const template = await this.createQueryBuilder('template')
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
