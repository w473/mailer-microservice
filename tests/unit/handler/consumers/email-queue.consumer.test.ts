import { Test, TestingModule } from '@nestjs/testing';
import { EmailQueueConsumer } from 'src/handler/consumers/email-queue.consumer';
import { EmailSendService } from 'src/application/services/email-send.service';
import { Job } from 'bull';
import { createMock } from 'ts-auto-mock';
import { Logger } from '@nestjs/common/services/logger.service';

describe('EmailQueueConsumer test', () => {
  let emailQueueConsumer: EmailQueueConsumer;
  const emailSendServiceMock = {
    sendEmailById: jest.fn(),
  };
  const loggerMock = {
    warn: jest.fn(),
    log: jest.fn(),
    error: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailQueueConsumer,
        {
          provide: EmailSendService,
          useValue: emailSendServiceMock,
        },
      ],
    }).compile();

    module.useLogger(loggerMock);

    emailQueueConsumer = await module.get(EmailQueueConsumer);
  });

  afterEach(() => jest.clearAllMocks());

  describe('sendEmail', () => {
    it('sendEmail proper', async () => {
      const emailId = 666;
      const job = createMock<Job<{ emailId: number }>>();
      job.data.emailId = emailId;
      await emailQueueConsumer.sendEmail(job);
      expect(emailSendServiceMock.sendEmailById).toBeCalledWith(emailId);
      expect(loggerMock.warn).not.toBeCalled();
    });

    it('sendEmail log warning', async () => {
      const emailId = 666;
      const job = createMock<Job<{ emailId: number }>>();
      job.data.emailId = emailId;

      const error = new Error('just broken');
      emailSendServiceMock.sendEmailById = jest.fn().mockImplementation(() => {
        throw error;
      });
      await emailQueueConsumer.sendEmail(job);
      expect(emailSendServiceMock.sendEmailById).toBeCalledWith(emailId);
      expect(loggerMock.warn).toBeCalledWith(error, 'EmailQueueConsumer');
    });
  });
});
