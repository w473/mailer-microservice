import { ConfigService } from '@nestjs/config';
import { EmailEntity } from 'src/infrastructure/db/entities/email.entity';
import { Test, TestingModule } from '@nestjs/testing';
import {
  EMAIL_TRANSPORTER,
  EmailSendService,
} from 'src/application/services/email-send.service';
import { DomainException } from 'src/domain/exceptions/domain.exception';
import { EmailRepositoryInterface } from 'src/domain/repositories/email.repository.interface';

const OriginalDate = Date;
const localDate = '2020-05-14T11:01:58.135Z';
class MockDate extends Date {
  constructor() {
    super(localDate);
  }
}

describe('EmailSendService', () => {
  let emailSendService: EmailSendService;
  let configService: ConfigService;

  let emailRepositoryMock: EmailRepositoryInterface;

  let transporter: { sendMail };

  const RealDate = Date;

  beforeEach(async () => {
    global.Date = MockDate as unknown as typeof Date;
    emailRepositoryMock = {
      findAndCount: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
    };
    transporter = {
      sendMail: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailSendService,
        {
          provide: 'EmailRepositoryInterface',
          useValue: emailRepositoryMock,
        },
        {
          provide: EMAIL_TRANSPORTER,
          useValue: transporter,
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              switch (key) {
                case 'EMAIL_SERVICE_HOST':
                  return 'a';
                case 'EMAIL_SERVICE_PORT':
                  return '12';
                case 'EMAIL_SERVICE_USER':
                  return 'b';
                case 'EMAIL_SERVICE_PASS':
                  return 'c';
                case 'EMAIL_FROM_NAME':
                  return 'd';
                case 'EMAIL_FROM_EMAIL':
                  return 'e';
              }
              return null;
            }),
          },
        },
      ],
    }).compile();

    emailSendService = await module.get(EmailSendService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    global.Date = OriginalDate;
  });

  describe('sendEmailById', () => {
    it('should sendEmailById throw exception', async () => {
      const emailId = 666;
      emailRepositoryMock.findOne = jest.fn().mockReturnValueOnce(null);
      await expect(emailSendService.sendEmailById(emailId)).rejects.toThrow(
        new DomainException('Email has not been found'),
      );
    });

    it('should sendEmailById properly', async () => {
      const emailId = 666;
      const email: EmailEntity = {
        id: emailId,
        recipients: [
          {
            id: 555,
            email: null,
            userId: 'asdasd',
            emailAddress: 'wwwwwww',
            name: 'asdasdasd',
          },
        ],
        subject: 'potTO',
        contents: 'EEEE',
        sent: null,
        error: null,
        template: null,
      };
      emailRepositoryMock.findOne = jest.fn().mockReturnValueOnce(email);
      await emailSendService.sendEmailById(emailId);
      expect(emailRepositoryMock.findOne).toBeCalledWith(emailId);
      expect(transporter.sendMail).toBeCalledWith({
        from: 'd <e>',
        html: 'EEEE',
        subject: 'potTO',
        to: 'asdasdasd <wwwwwww> ',
      });
      expect(emailRepositoryMock.save).toBeCalledWith({
        contents: 'EEEE',
        error: null,
        id: 666,
        recipients: [
          {
            email: null,
            emailAddress: 'wwwwwww',
            id: 555,
            name: 'asdasdasd',
            userId: 'asdasd',
          },
        ],
        sent: new Date(),
        subject: 'potTO',
        template: null,
      });
    });

    it('should sendMail throw exception', async () => {
      const emailId = 666;
      const email: EmailEntity = {
        id: emailId,
        recipients: [
          {
            id: 555,
            email: null,
            userId: 'asdasd',
            emailAddress: 'wwwwwww',
            name: 'asdasdasd',
          },
        ],
        subject: 'potTO',
        contents: 'EEEE',
        sent: null,
        error: null,
        template: null,
      };
      transporter.sendMail = jest
        .fn()
        .mockImplementation(() => Promise.reject(new Error('some error')));
      emailRepositoryMock.findOne = jest.fn().mockReturnValueOnce(email);
      await emailSendService.sendEmailById(emailId);
      expect(emailRepositoryMock.findOne).toBeCalledWith(emailId);
      expect(transporter.sendMail).toBeCalledWith({
        from: 'd <e>',
        html: 'EEEE',
        subject: 'potTO',
        to: 'asdasdasd <wwwwwww> ',
      });
      expect(emailRepositoryMock.save).toBeCalledWith({
        contents: 'EEEE',
        error: 'Error: ["Error: some error"]',
        id: 666,
        recipients: [
          {
            email: null,
            emailAddress: 'wwwwwww',
            id: 555,
            name: 'asdasdasd',
            userId: 'asdasd',
          },
        ],
        sent: null,
        subject: 'potTO',
        template: null,
      });
    });
  });
});
