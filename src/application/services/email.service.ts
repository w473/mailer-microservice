import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Handlebars = require('handlebars');
import { createTransport } from 'nodemailer';
import { EmailTemplateEntity } from '../../infrastructure/db/entities/email-template.entity';
import { EmailSendRequestDto } from '../../handler/dtos/email-send-request.dto';
import { EmailEntity } from '../../infrastructure/db/entities/email.entity';
import { DomainException } from 'src/domain/exceptions/domain.exception';
import { EmailRecipientEntity } from 'src/infrastructure/db/entities/email-recipient.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  constructor(
    @InjectRepository(EmailTemplateEntity)
    private emailTemplateRepository: Repository<EmailTemplateEntity>,

    @InjectRepository(EmailEntity)
    private emailRepository: Repository<EmailEntity>,
    private configService: ConfigService,
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
      host: this.configService.get('EMAIL_SERVICE_HOST'),
      port: Number.parseInt(this.configService.get('EMAIL_SERVICE_PORT'), 10),
      secure: this.configService.get('EMAIL_SERVICE_PORT') === '465',
      auth: {
        user: this.configService.get('EMAIL_SERVICE_USER'),
        pass: this.configService.get('EMAIL_SERVICE_PASS'),
      },
    });
    const fromName = this.configService.get('EMAIL_FROM_NAME');
    const fromEmail = this.configService.get('EMAIL_FROM_EMAIL');
    email.recipients.forEach((recipient) => {
      void transporter.sendMail({
        from: `${fromName} <${fromEmail}>`,
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
