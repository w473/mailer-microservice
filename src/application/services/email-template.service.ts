import { Inject, Injectable } from '@nestjs/common';
import { EmailTemplateEntity } from '../../infrastructure/db/entities/email-template.entity';
import { EmailTemplateLocaleDto } from '../../handler/dtos/email-template-locale.dto';
import { EmailTemplateLocaleEntity } from 'src/infrastructure/db/entities/email-template-locale.entity';
import { EmailTemplateNewDto } from 'src/handler/dtos/email-template-new.dto';
import { EmailTemplateRepositoryInterface } from 'src/domain/repositories/email-template.repository.interface';
import { EmailTemplateLocaleRepositoryInterface } from 'src/domain/repositories/email-template-locale.repository.interface';
import { NotFoundException } from 'src/domain/exceptions/not-found.exception';

@Injectable()
export class EmailTemplateService {
  constructor(
    @Inject('EmailTemplateRepositoryInterface')
    private readonly emailTemplateRepository: EmailTemplateRepositoryInterface,
    @Inject('EmailTemplateLocaleRepositoryInterface')
    private readonly emailTemplateLocaleRepository: EmailTemplateLocaleRepositoryInterface,
  ) {}

  async findAllTemplates(
    where: any,
    limit = 10,
    page = 0,
  ): Promise<[EmailTemplateEntity[], number]> {
    return this.emailTemplateRepository.findAndCount({
      where,
      limit,
      page,
    });
  }

  async getById(templateId: number): Promise<EmailTemplateEntity> {
    return this.emailTemplateRepository.findOne(templateId);
  }

  async addTemplate(emailTemplateDto: EmailTemplateNewDto): Promise<void> {
    const emailTemplateEntity = new EmailTemplateEntity();
    emailTemplateEntity.name = emailTemplateDto.name;
    emailTemplateEntity.locales = [];
    for (let i = 0; i < emailTemplateDto.locales.length; i++) {
      emailTemplateEntity.locales.push({
        locale: emailTemplateDto.locales[i].locale,
        subject: emailTemplateDto.locales[i].subject,
        contents: emailTemplateDto.locales[i].contents,
      });
    }
    await this.emailTemplateRepository.save(emailTemplateEntity);
  }

  async saveTemplate(emailTemplateEntity: EmailTemplateEntity): Promise<void> {
    await this.emailTemplateRepository.save(emailTemplateEntity);
  }

  async saveTemplateLocale(
    emailTemplateEntity: EmailTemplateEntity,
    emailTemplateLocaleDto: EmailTemplateLocaleDto,
  ): Promise<void> {
    let emailTemplateLocaleEntity = emailTemplateEntity.locales.find(
      (localeEntity) => localeEntity.locale === emailTemplateLocaleDto.locale,
    );
    if (!emailTemplateLocaleEntity) {
      emailTemplateLocaleEntity = new EmailTemplateLocaleEntity();
      emailTemplateLocaleEntity.locale = emailTemplateLocaleDto.locale;
      emailTemplateLocaleEntity.template = emailTemplateEntity;
    }

    emailTemplateLocaleEntity.subject = emailTemplateLocaleDto.subject;
    emailTemplateLocaleEntity.contents = emailTemplateLocaleDto.contents;
    await this.emailTemplateLocaleRepository.save(emailTemplateLocaleEntity);
  }

  async deleteTemplate(
    emailTemplateEntity: EmailTemplateEntity,
  ): Promise<void> {
    await this.emailTemplateRepository.remove(emailTemplateEntity);
  }

  async deleteTemplateLocale(
    emailTemplateEntity: EmailTemplateEntity,
    locale: string,
  ): Promise<void> {
    const localeEntity = emailTemplateEntity.locales.find(
      (localeEntity) => localeEntity.locale === locale,
    );

    if (!localeEntity) {
      throw new NotFoundException('Template locale does not exists');
    }
    await this.emailTemplateLocaleRepository.remove(localeEntity);
  }
}
