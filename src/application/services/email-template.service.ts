import { Inject, Injectable } from '@nestjs/common';
import { EmailTemplateEntity } from '../../infrastructure/db/entities/email-template.entity';
import { EmailTemplateLocaleDto } from '../../handler/dtos/email-template-locale.dto';
import { DomainException } from 'src/domain/exceptions/domain.exception';
import { EmailTemplateLocaleEntity } from 'src/infrastructure/db/entities/email-template-locale.entity';
import { EmailTemplateNewDto } from 'src/handler/dtos/email-template-new.dto';
import { EmailTemplateRepositoryInterface } from 'src/domain/repositories/email-template.repository.interface';
import { EmailTemplateLocaleRepositoryInterface } from 'src/domain/repositories/email-template-locale.repository.interface';

@Injectable()
export class EmailTemplateService {
  constructor(
    @Inject('EmailTemplateRepositoryInterface')
    private emailTemplateRepository: EmailTemplateRepositoryInterface,
    @Inject('EmailTemplateLocaleRepositoryInterface')
    private emailTemplateLocaleRepository: EmailTemplateLocaleRepositoryInterface,
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
    templateId: number,
    emailTemplateLocaleDto: EmailTemplateLocaleDto,
  ): Promise<void> {
    const emailTemplateEntity = await this.getById(templateId);
    if (!emailTemplateEntity) {
      throw new DomainException('Email template does not exists');
    }

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

  async deleteTemplateById(templateId: number): Promise<void> {
    const emailTemplateEntity = await this.getById(templateId);
    if (!emailTemplateEntity) {
      throw new DomainException('Email template does not exists');
    }
    await this.emailTemplateRepository.remove(emailTemplateEntity);
  }

  async deleteTemplateLocaleById(
    templateId: number,
    locale: string,
  ): Promise<void> {
    const emailTemplateEntity = await this.getById(templateId);
    if (!emailTemplateEntity) {
      throw new DomainException('Email template does not exists');
    }
    const localeEntity = emailTemplateEntity.locales.find(
      (localeEntity) => localeEntity.locale === locale,
    );

    if (!localeEntity) {
      throw new DomainException('Email template locale does not exists');
    }
    await this.emailTemplateLocaleRepository.remove(localeEntity);
  }
}
