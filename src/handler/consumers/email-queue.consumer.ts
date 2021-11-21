import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { EmailSendService } from 'src/application/services/email-send.service';
import { Logger } from '@nestjs/common/services/logger.service';
export const EMAIL_SEND_QUEUE = 'sendEmail';

@Processor('emails')
export class EmailQueueConsumer {
  private readonly logger = new Logger(EmailQueueConsumer.name);

  constructor(private readonly emailSendService: EmailSendService) {}

  @Process(EMAIL_SEND_QUEUE)
  async sendEmail(job: Job<{ emailId: number }>) {
    try {
      await this.emailSendService.sendEmailById(job.data.emailId);
    } catch (error) {
      this.logger.warn(error);
    }
  }
}
