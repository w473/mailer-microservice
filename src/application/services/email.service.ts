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
import { EmailTemplateRepositoryInterface } from 'src/domain/repositories/email-template.repository.interface';
import { EmailTemplateLocaleEntity } from 'src/infrastructure/db/entities/email-template-locale.entity';
import { RecipientDto } from 'src/handler/dtos/recipient.dto';

@Injectable()
export class EmailService {
  constructor(
    @InjectRepository(EmailTemplateEntity)
    private emailTemplateRepository: EmailTemplateRepositoryInterface,

    @InjectRepository(EmailEntity)
    private emailRepository: Repository<EmailEntity>,
    private configService: ConfigService,
    @InjectQueue('emails') private emailsQueue: Queue,
  ) {
    this.initHandleBars();
  }
  private initHandleBars(): void {
    Handlebars.registerHelper('helperMissing', (...args) => {
      const options = args[args.length - 1];
      throw new DomainException('Missing: ' + options.name);
    });
  }

  private findProperLocaleInTemplate(
    template: EmailTemplateEntity,
    localeToFind: string,
    fallbackLocale: string,
  ): EmailTemplateLocaleEntity {
    let templateLocale = template.locales.find(
      (element) => element.locale === localeToFind,
    );
    if (!templateLocale) {
      templateLocale = template.locales.find(
        (element) => element.locale === fallbackLocale,
      );
    }
    if (!templateLocale) {
      throw new DomainException(
        'Fallback locale does not exists for this template',
      );
    }
    return templateLocale;
  }

  private compile(template: string, variables: Record<string, string>): string {
    const compileByHandlebars = Handlebars.compile(template);
    return compileByHandlebars(variables);
  }

  private prepareVariables(
    requestVariables: Record<string, string>,
    recipient: RecipientDto,
  ): Record<string, string> {
    return Object.assign(requestVariables, {
      recipientUserId: recipient.userId,
      recipientEmail: recipient.email,
      recipientName: recipient.name,
    });
  }

  async send(emailSendRequestDto: EmailSendRequestDto): Promise<void> {
    const template =
      await this.emailTemplateRepository.getTemplateByNameAndLocale(
        emailSendRequestDto.templateName,
        emailSendRequestDto.locale,
        this.configService.get('FALLBACK_LOCALE'),
      );
    const templateLocale = this.findProperLocaleInTemplate(
      template,
      emailSendRequestDto.locale,
      this.configService.get('FALLBACK_LOCALE'),
    );

    const variables = this.prepareVariables(
      emailSendRequestDto.variables,
      emailSendRequestDto.recipient,
    );

    const email = new EmailEntity();
    email.template = template;
    email.subject = this.compile(templateLocale.subject, variables);
    email.contents = this.compile(templateLocale.contents, variables);
    const recipient = new EmailRecipientEntity();
    recipient.emailAddress = emailSendRequestDto.recipient.email;
    recipient.userId = emailSendRequestDto.recipient.userId;
    recipient.name = emailSendRequestDto.recipient.name;
    recipient.email = email;
    email.recipients = [recipient];
    await this.emailRepository.save(email);

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
