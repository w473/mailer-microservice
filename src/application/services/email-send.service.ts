import { EmailEntity } from 'src/infrastructure/db/entities/email.entity';
import { createTransport, Transporter } from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class EmailSendService {
  transporter: Transporter<SMTPTransport.SentMessageInfo>;

  constructor(
    private configService: ConfigService,
    @InjectRepository(EmailEntity)
    private emailRepository: Repository<EmailEntity>,
  ) {
    this.transporter = this.getTransporter();
  }

  private getTransporter(): Transporter<SMTPTransport.SentMessageInfo> {
    return createTransport({
      host: this.configService.get('EMAIL_SERVICE_HOST'),
      port: Number.parseInt(this.configService.get('EMAIL_SERVICE_PORT'), 10),
      secure: this.configService.get('EMAIL_SERVICE_PORT') === '465',
      auth: {
        user: this.configService.get('EMAIL_SERVICE_USER'),
        pass: this.configService.get('EMAIL_SERVICE_PASS'),
      },
    });
  }

  async sendEmailById(emailId: number): Promise<void> {
    const email = await this.emailRepository.findOne(emailId, {
      relations: ['recipients'],
    });
    if (!email) {
      throw new Error('Email has not been found');
    }
    const fromName = this.configService.get('EMAIL_FROM_NAME');
    const fromEmail = this.configService.get('EMAIL_FROM_EMAIL');
    const promises = new Array<Promise<SMTPTransport.SentMessageInfo>>();
    email.recipients.forEach((recipient) => {
      promises.push(
        this.transporter.sendMail({
          from: `${fromName} <${fromEmail}>`,
          to: `${recipient.name} <${recipient.emailAddress}> `,
          subject: email.subject,
          html: email.contents,
        }),
      );
    });
    try {
      await Promise.all(promises);
      email.sent = new Date();
    } catch (error) {
      email.error = JSON.stringify(error);
    }
    await this.emailRepository.save(email);
  }
}
