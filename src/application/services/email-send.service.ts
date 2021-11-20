import { Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { DomainException } from 'src/domain/exceptions/domain.exception';
import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailRepositoryInterface } from 'src/domain/repositories/email.repository.interface';

export const EMAIL_TRANSPORTER = 'EMAIL_TRANSPORTER';

export class EmailSendService {
  fromName: string;
  fromEmail: string;

  constructor(
    @Inject(EMAIL_TRANSPORTER)
    private transporter: Transporter<SMTPTransport.SentMessageInfo>,
    @Inject('EmailRepositoryInterface')
    private emailRepository: EmailRepositoryInterface,
    private configService: ConfigService,
  ) {
    this.fromName = configService.get('EMAIL_FROM_NAME');
    this.fromEmail = configService.get('EMAIL_FROM_EMAIL');
  }

  async sendEmailById(emailId: number): Promise<void> {
    const email = await this.emailRepository.findOne(emailId);
    if (!email) {
      throw new DomainException('Email has not been found');
    }

    const promises = new Array<Promise<SMTPTransport.SentMessageInfo>>();

    email.recipients.forEach((recipient) => {
      promises.push(
        this.transporter.sendMail({
          from: `${this.fromName} <${this.fromEmail}>`,
          to: `${recipient.name} <${recipient.emailAddress}> `,
          subject: email.subject,
          html: email.contents,
        }),
      );
    });
    try {
      const settledPromises = await Promise.allSettled(promises);
      const errors = [];
      settledPromises.forEach((value) => {
        if (value.status == 'rejected') {
          errors.push((<Error>value.reason).toString());
        }
      });
      if (errors.length > 0) {
        throw new Error(JSON.stringify(errors));
      }

      email.sent = new Date();
    } catch (error) {
      email.error = error.toString();
    }
    await this.emailRepository.save(email);
  }
}
