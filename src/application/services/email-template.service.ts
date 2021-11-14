import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailTemplateEntity } from '../../infrastructure/db/entities/email-template.entity';
import { EmailTemplateDto } from '../../handler/dtos/email-template.dto';
import { EmailTemplateLocaleDto } from '../../handler/dtos/email-template-locale.dto';

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

  async addTemplate(emailTemplateDto: EmailTemplateDto): Promise<void> {
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
    if (emailTemplateEntity) {
      throw new Error('Email template does not exists');
    }
    const index = emailTemplateEntity.locales.findIndex(
      (localeEntity) => localeEntity.locale === emailTemplateLocaleDto.locale,
    );
    if (index) {
      emailTemplateEntity.locales[index].subject =
        emailTemplateLocaleDto.subject;
      emailTemplateEntity.locales[index].contents =
        emailTemplateLocaleDto.contents;
    } else {
      emailTemplateEntity.locales.push({
        subject: emailTemplateLocaleDto.subject,
        contents: emailTemplateLocaleDto.contents,
        locale: emailTemplateLocaleDto.locale,
      });
    }
    await this.emailTemplateRepository.save(emailTemplateEntity);
  }

  async deleteTemplateById(templateId: number): Promise<void> {
    const emailTemplateEntity = await this.getById(templateId);
    if (emailTemplateEntity) {
      throw new Error('Email template does not exists');
    }
    await this.emailTemplateRepository.remove(emailTemplateEntity);
  }

  async deleteTemplateLocaleById(
    templateId: number,
    locale: string,
  ): Promise<void> {
    const emailTemplateEntity = await this.getById(templateId);
    if (emailTemplateEntity) {
      throw new Error('Email template does not exists');
    }
    const index = emailTemplateEntity.locales.findIndex(
      (localeEntity) => localeEntity.locale === locale,
    );
    if (!index) {
      throw new Error('Email template locale does not exists');
    }
    emailTemplateEntity.locales.splice(index, 1);
    await this.emailTemplateRepository.save(emailTemplateEntity);
  }
}
