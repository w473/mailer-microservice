import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { EmailSendService } from 'src/application/services/email-send.service';
export const EMAIL_SEND_QUEUE = 'sendEmail';

@Processor('emails')
export class EmailQueueConsumer {
  constructor(private readonly emailSendService: EmailSendService) {}

  @Process(EMAIL_SEND_QUEUE)
  async sendEmail(job: Job<{ emailId: number }>) {
    try {
      await this.emailSendService.sendEmail(job.data.emailId);
    } catch (error) {
      console.log(error);
    }
  }
}
