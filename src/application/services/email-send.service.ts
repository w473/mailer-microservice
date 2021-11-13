import { QueryFailedError, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailTemplateEntity } from '../../infrastructure/db/entities/email-template.entity';
import { EmailSendRequestDto } from '../../handler/dtos/email-send-request.dto';
import { config } from '../../config';
import Handlebars = require('handlebars');
import { EmailEntity } from '../../infrastructure/db/entities/email.entity';
import { createTransport } from 'nodemailer';
import { RecipientDto } from '../../handler/dtos/recipient.dto';

@Injectable()
export class EmailSendService {

  constructor(
    @InjectRepository(EmailTemplateEntity)
    private emailTemplateRepository: Repository<EmailTemplateEntity>,

    @InjectRepository(EmailEntity)
    private emailRepository: Repository<EmailEntity>
  ) { }

  async send (emailSendRequestDto: EmailSendRequestDto): Promise<void> {
    const template = await this.emailTemplateRepository.findOne({
      where: {
        name: emailSendRequestDto.templateName,
        locales: { locale: [emailSendRequestDto.locale, config.other.fallbackLocale] },
      },
      relations: ["templateLocales"],
    });

    if (template) {
      throw new Error('Requested locale and fallback does not exists')
    }

    let templateLocale = template.locales.find(element => element.locale === emailSendRequestDto.locale);
    if (!templateLocale) {
      templateLocale = template.locales[0];
    }

    const templateSubject = Handlebars.compile(templateLocale.subject);
    const templateContents = Handlebars.compile(templateLocale.contents);

    const variables = Object.assign(
      emailSendRequestDto.variables ?? {},
      {
        recepientUserId: emailSendRequestDto.recepient.userId,
        recepientEmail: emailSendRequestDto.recepient.email,
        recepientName: emailSendRequestDto.recepient.name
      }
    );
    const email = new EmailEntity();
    email.subject = templateSubject(variables);
    email.contents = templateContents(variables);
    email.recepients = [
      {
        userId: emailSendRequestDto.recepient.userId,
        email: emailSendRequestDto.recepient.email,
        name: emailSendRequestDto.recepient.name,
      }
    ];

    await this.emailRepository.save(email);



    this.sendEmail(email);
  }

  private async sendEmail (email: EmailEntity): Promise<void> {
    //needs to be replaced with e.g. Bull
    const transporter = createTransport(
      {
        connection: {
          host: config.emailService.connection.host,
          port: config.emailService.connection.port,
          secure: config.emailService.connection.port == '465',
          auth: {
            user: config.emailService.connection.auth.user,
            pass: config.emailService.connection.auth.pass
          }

        }
      }
    );

    email.recepients.forEach(recipient => {
      transporter.sendMail({
        from: `${config.emailService.from.name} <${config.emailService.from.email}>`,
        to: `${recipient.name} <${recipient.email}> `,
        subject: email.subject,
        html: email.contents
      })
    });

  }
}