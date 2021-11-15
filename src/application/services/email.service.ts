import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Handlebars = require('handlebars');
import { EmailTemplateEntity } from '../../infrastructure/db/entities/email-template.entity';
import { EmailSendRequestDto } from '../../handler/dtos/email-send-request.dto';
import { EmailEntity } from '../../infrastructure/db/entities/email.entity';
import { DomainException } from 'src/domain/exceptions/domain.exception';
import { EmailRecipientEntity } from 'src/infrastructure/db/entities/email-recipient.entity';
import { ConfigService } from '@nestjs/config';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { EMAIL_SEND_QUEUE } from 'src/handler/consumers/email-queue.consumer';

@Injectable()
export class EmailService {
  constructor(
    @InjectRepository(EmailTemplateEntity)
    private emailTemplateRepository: Repository<EmailTemplateEntity>,

    @InjectRepository(EmailEntity)
    private emailRepository: Repository<EmailEntity>,
    private configService: ConfigService,
    @InjectQueue('emails') private emailsQueue: Queue,
  ) {}

  async send(emailSendRequestDto: EmailSendRequestDto): Promise<void> {
    const template = await this.emailTemplateRepository
      .createQueryBuilder('template')
      .innerJoinAndSelect('template.locales', 'locale')
      .where('template.name = :name ', {
        name: emailSendRequestDto.templateName,
      })
      .andWhere('locale.locale IN (:locale, :fallbackLocale)', {
        locale: emailSendRequestDto.locale,
        fallbackLocale: this.configService.get('FALLBACK_LOCALE'),
      })
      .getOne();
    if (!template) {
      throw new DomainException(
        'Requested locale and fallback does not exists',
      );
    }

    let templateLocale = template.locales.find(
      (element) => element.locale === emailSendRequestDto.locale,
    );
    if (!templateLocale) {
      templateLocale = template.locales[0];
    }

    Handlebars.registerHelper('helperMissing', (...argumentsz) => {
      const options = argumentsz[argumentsz.length - 1];
      throw new DomainException('Missing: ' + options.name);
    });
    const templateSubject = Handlebars.compile(templateLocale.subject);
    const templateContents = Handlebars.compile(templateLocale.contents);

    const variables = Object.assign(emailSendRequestDto.variables ?? {}, {
      recipientUserId: emailSendRequestDto.recipient.userId,
      recipientEmail: emailSendRequestDto.recipient.email,
      recipientName: emailSendRequestDto.recipient.name,
    });
    const email = new EmailEntity();
    email.template = template;
    email.subject = templateSubject(variables);
    email.contents = templateContents(variables);
    const recipient = new EmailRecipientEntity();
    recipient.emailAddress = emailSendRequestDto.recipient.email;
    recipient.userId = emailSendRequestDto.recipient.userId;
    recipient.name = emailSendRequestDto.recipient.name;
    recipient.email = email;
    email.recipients = [recipient];

    await this.emailRepository.manager.save([email, recipient]);

    await this.emailsQueue.add(
      EMAIL_SEND_QUEUE,
      { emailId: email.id },
      {
        removeOnComplete: true,
      },
    );
  }

  async findAllBy(
    where: any,
    limit = 10,
    page = 0,
  ): Promise<[EmailEntity[], number]> {
    return this.emailRepository.findAndCount({
      where: where,
      skip: page * limit,
      take: limit,
    });
  }
}
