import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Handlebars = require('handlebars');
import { createTransport } from 'nodemailer';
import { EmailTemplateEntity } from '../../infrastructure/db/entities/email-template.entity';
import { EmailSendRequestDto } from '../../handler/dtos/email-send-request.dto';
import { config } from '../../config';
import { EmailEntity } from '../../infrastructure/db/entities/email.entity';
import { EmailTemplateLocaleEntity } from 'src/infrastructure/db/entities/email-template-locale.entity';
import { DomainException } from 'src/domain/exceptions/domain.exception';
import { EmailRecipientEntity } from 'src/infrastructure/db/entities/email-recipient.entity';

@Injectable()
export class EmailService {
  constructor(
    @InjectRepository(EmailTemplateEntity)
    private emailTemplateRepository: Repository<EmailTemplateEntity>,

    @InjectRepository(EmailEntity)
    private emailRepository: Repository<EmailEntity>,
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
        fallbackLocale: config.other.fallbackLocale,
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

    await this.sendEmail(email);
  }

  private async sendEmail(email: EmailEntity): Promise<void> {
    // needs to be replaced with e.g. Bull
    const transporter = createTransport({
      host: config.emailService.connection.host,
      port: Number.parseInt(config.emailService.connection.port, 10),
      secure: config.emailService.connection.port === '465',
      auth: {
        user: config.emailService.connection.auth.user,
        pass: config.emailService.connection.auth.pass,
      },
    });

    email.recipients.forEach((recipient) => {
      void transporter.sendMail({
        from: `${config.emailService.from.name} <${config.emailService.from.email}>`,
        to: `${recipient.name} <${recipient.emailAddress}> `,
        subject: email.subject,
        html: email.contents,
      });
    });
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
