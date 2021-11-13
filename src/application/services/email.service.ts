import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Handlebars = require('handlebars');
import { createTransport } from 'nodemailer';
import { EmailTemplateEntity } from '../../infrastructure/db/entities/email-template.entity';
import { EmailSendRequestDto } from '../../handler/dtos/email-send-request.dto';
import { config } from '../../config';
import { EmailEntity } from '../../infrastructure/db/entities/email.entity';

@Injectable()
export class EmailService {
  constructor(
    @InjectRepository(EmailTemplateEntity)
    private emailTemplateRepository: Repository<EmailTemplateEntity>,

    @InjectRepository(EmailEntity)
    private emailRepository: Repository<EmailEntity>,
  ) {}

  async send(emailSendRequestDto: EmailSendRequestDto): Promise<void> {
    const template = await this.emailTemplateRepository.findOne({
      where: {
        name: emailSendRequestDto.templateName,
        locales: {
          locale: [emailSendRequestDto.locale, config.other.fallbackLocale],
        },
      },
      relations: ['templateLocales'],
    });

    if (template) {
      throw new Error('Requested locale and fallback does not exists');
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
    email.subject = templateSubject(variables);
    email.contents = templateContents(variables);
    email.recipients = [
      {
        userId: emailSendRequestDto.recipient.userId,
        email: emailSendRequestDto.recipient.email,
        name: emailSendRequestDto.recipient.name,
      },
    ];

    await this.emailRepository.save(email);
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
        to: `${recipient.name} <${recipient.email}> `,
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
