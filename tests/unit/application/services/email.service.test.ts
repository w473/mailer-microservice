import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from 'src/application/services/email.service';
import { EmailEntity } from 'src/infrastructure/db/entities/email.entity';
import { getQueueToken } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
import { EMAIL_SEND_QUEUE } from 'src/handler/consumers/email-queue.consumer';
import { DomainException } from 'src/domain/exceptions/domain.exception';
import { EmailTemplateRepositoryInterface } from 'src/domain/repositories/email-template.repository.interface';
import {
  emailEntity,
  emailEntity2,
  emailSendRequestDto,
} from '../../../__mockdata__/emails';
import { emailTemplateEntity } from '../../../__mockdata__/templates';

describe('EmailService', () => {
  let emailService: EmailService;
  let configService: ConfigService;

  const fallBackLocale = 'en_US';

  const emailId = 123;
  const emailTemplateRepositoryMock = {
    getTemplateByNameAndLocale: jest.fn(),
  };
  const emailRepositoryMock = {
    save: jest.fn().mockImplementation((emailEntity: EmailEntity) => {
      emailEntity.id = emailId;
    }),
    findAndCount: jest.fn().mockImplementation((args: any) => {
      return [[], 0];
    }),
  };

  const emailsQueueMock = {
    add: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: 'EmailTemplateRepositoryInterface',
          useValue: emailTemplateRepositoryMock,
        },
        {
          provide: 'EmailRepositoryInterface',
          useValue: emailRepositoryMock,
        },
        {
          provide: getQueueToken('emails'),
          useValue: emailsQueueMock,
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'FALLBACK_LOCALE') {
                return fallBackLocale;
              }
              return null;
            }),
          },
        },
      ],
    }).compile();

    emailService = await module.get(EmailService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('findAllBy', () => {
    it('findAllBy proper', async () => {
      const ret = await emailService.findAllBy({}, 20, 3);

      expect(ret).toEqual([[], 0]);

      expect(emailRepositoryMock.findAndCount).toBeCalledWith({
        where: {},
        limit: 20,
        page: 3,
      });
    });

    it('findAllBy proper but with defaults', async () => {
      const ret = await emailService.findAllBy({});

      expect(ret).toEqual([[], 0]);

      expect(emailRepositoryMock.findAndCount).toBeCalledWith({
        where: {},
        page: 0,
        limit: 10,
      });
    });
  });

  describe('send', () => {
    it('should send email to queue', async () => {
      emailTemplateRepositoryMock.getTemplateByNameAndLocale = jest
        .fn()
        .mockReturnValueOnce(emailTemplateEntity);

      await emailService.send(emailSendRequestDto);

      expect(configService.get).toBeCalledWith('FALLBACK_LOCALE');

      expect(
        emailTemplateRepositoryMock.getTemplateByNameAndLocale,
      ).toBeCalledWith(
        emailSendRequestDto.templateName,
        emailSendRequestDto.locale,
        fallBackLocale,
      );

      emailEntity.recipients[0].email = emailEntity;
      emailEntity.error = undefined;
      emailEntity.sent = undefined;
      expect(emailRepositoryMock.save).toBeCalledWith(emailEntity);

      expect(emailsQueueMock.add).toBeCalledWith(
        EMAIL_SEND_QUEUE,
        { emailId: emailId },
        {
          removeOnComplete: true,
        },
      );
    });

    it('should send email to queue with fallback locale', async () => {
      emailTemplateRepositoryMock.getTemplateByNameAndLocale = jest
        .fn()
        .mockReturnValueOnce(emailTemplateEntity);

      emailSendRequestDto.locale = 'de_DE';

      await emailService.send(emailSendRequestDto);

      expect(configService.get).toBeCalledWith('FALLBACK_LOCALE');

      expect(
        emailTemplateRepositoryMock.getTemplateByNameAndLocale,
      ).toBeCalledWith(
        emailSendRequestDto.templateName,
        emailSendRequestDto.locale,
        fallBackLocale,
      );

      emailEntity2.recipients[0].email = emailEntity2;
      expect(emailRepositoryMock.save).toBeCalledWith(emailEntity2);

      expect(emailsQueueMock.add).toBeCalledWith(
        EMAIL_SEND_QUEUE,
        { emailId: emailId },
        {
          removeOnComplete: true,
        },
      );
    });

    it('should throw exception - not found variables', async () => {
      emailSendRequestDto.variables = {};
      emailTemplateRepositoryMock.getTemplateByNameAndLocale = jest
        .fn()
        .mockReturnValueOnce(emailTemplateEntity);

      await expect(emailService.send(emailSendRequestDto)).rejects.toThrowError(
        new DomainException('Missing: variableUno'),
      );

      expect(configService.get).toBeCalledWith('FALLBACK_LOCALE');

      expect(
        emailTemplateRepositoryMock.getTemplateByNameAndLocale,
      ).toBeCalledWith(
        emailSendRequestDto.templateName,
        emailSendRequestDto.locale,
        fallBackLocale,
      );

      expect(emailRepositoryMock.save).not.toBeCalled();

      expect(emailsQueueMock.add).not.toBeCalled();
    });

    it('should throw exception - not found fallback locale', async () => {
      emailTemplateEntity.locales[0].locale = 'csd';
      emailTemplateEntity.locales[1].locale = 'ssss';

      emailTemplateRepositoryMock.getTemplateByNameAndLocale = jest
        .fn()
        .mockReturnValueOnce(emailTemplateEntity);

      await expect(emailService.send(emailSendRequestDto)).rejects.toThrowError(
        new DomainException(
          'Fallback locale does not exists for this template',
        ),
      );

      expect(configService.get).toBeCalledWith('FALLBACK_LOCALE');

      expect(
        emailTemplateRepositoryMock.getTemplateByNameAndLocale,
      ).toBeCalledWith(
        emailSendRequestDto.templateName,
        emailSendRequestDto.locale,
        fallBackLocale,
      );

      expect(emailRepositoryMock.save).not.toBeCalled();

      expect(emailsQueueMock.add).not.toBeCalled();
    });
  });
});
