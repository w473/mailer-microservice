import { EmailTemplateEntity } from 'src/infrastructure/db/entities/email-template.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { EmailTemplateRepositoryInterface } from 'src/domain/repositories/email-template.repository.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { DuplicateException } from 'src/domain/exceptions/duplicate.exception';

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

  async findAndCount({
    where,
    limit,
    page,
  }: {
    where: any;
    limit: number;
    page: number;
  }): Promise<[EmailTemplateEntity[], number]> {
    return this.emailTemplateRepository.findAndCount({
      where,
      skip: limit * page,
      take: limit,
      relations: ['locales'],
    });
  }

  async findOne(templateId: number): Promise<EmailTemplateEntity> {
    return this.emailTemplateRepository.findOne(templateId, {
      relations: ['locales'],
    });
  }

  async save(
    emailTemplateEntity: EmailTemplateEntity,
  ): Promise<EmailTemplateEntity> {
    try {
      return await this.emailTemplateRepository.save(emailTemplateEntity);
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

  async remove(emailTemplateEntity: EmailTemplateEntity): Promise<void> {
    await this.emailTemplateRepository.remove(emailTemplateEntity);
  }
}
