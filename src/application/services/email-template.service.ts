import { QueryFailedError, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailTemplateEntity } from '../../infrastructure/db/entities/email-template.entity';
import { EmailTemplateDto } from '../../handler/dtos/email-template.dto';
import { EmailTemplateLocaleDto } from '../../handler/dtos/email-template-locale.dto';
import { DomainException } from 'src/domain/exceptions/domain.exception';
import { EmailTemplateLocaleEntity } from 'src/infrastructure/db/entities/email-template-locale.entity';
import { EmailTemplateNewDto } from 'src/handler/dtos/email-template-new.dto';
import { DuplicateException } from 'src/domain/exceptions/duplicate.exception';

@Injectable()
export class EmailTemplateService {
  constructor(
    @InjectRepository(EmailTemplateEntity)
    private emailTemplateRepository: Repository<EmailTemplateEntity>,
  ) {}

  async findAllTemplates(
    where: any,
    limit = 10,
    offset = 0,
  ): Promise<[EmailTemplateEntity[], number]> {
    return this.emailTemplateRepository.findAndCount({
      where: where,
      skip: offset * limit,
      take: limit,
      relations: ['locales'],
    });
  }

  async getById(templateId: number): Promise<EmailTemplateEntity> {
    return this.emailTemplateRepository.findOne(templateId, {
      relations: ['locales'],
    });
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
    try {
      await this.emailTemplateRepository.save(emailTemplateEntity);
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        error.driverError.code === '23505'
      ) {
        throw new DuplicateException("You can't use this template name");
      }
      throw error;
    }
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
    await this.emailTemplateRepository.manager.save(emailTemplateLocaleEntity);
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
    await this.emailTemplateRepository.manager.remove(localeEntity);
  }
}
