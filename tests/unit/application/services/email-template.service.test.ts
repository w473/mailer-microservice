import { Test, TestingModule } from '@nestjs/testing';
import { EmailTemplateService } from 'src/application/services/email-template.service';
import { EmailTemplateRepositoryInterface } from 'src/domain/repositories/email-template.repository.interface';
import { EmailTemplateLocaleRepositoryInterface } from 'src/domain/repositories/email-template-locale.repository.interface';
import { DomainException } from 'src/domain/exceptions/domain.exception';
import {
  emailTemplateDto,
  emailTemplateEntity,
} from '../../../__mockdata__/templates';

describe('EmailTemplateService', () => {
  let emailTemplateService: EmailTemplateService;

  const emailTemplateRepositoryMock: EmailTemplateRepositoryInterface = {
    getTemplateByNameAndLocale: jest.fn(),
    findAndCount: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };
  const emailTemplateLocaleRepositoryMock: EmailTemplateLocaleRepositoryInterface =
    {
      save: jest.fn(),
      remove: jest.fn(),
    };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailTemplateService,
        {
          provide: 'EmailTemplateRepositoryInterface',
          useValue: emailTemplateRepositoryMock,
        },
        {
          provide: 'EmailTemplateLocaleRepositoryInterface',
          useValue: emailTemplateLocaleRepositoryMock,
        },
      ],
    }).compile();

    emailTemplateService = await module.get(EmailTemplateService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('findAllTemplates', () => {
    it('should findAllTemplates properly', async () => {
      const where = {};
      const limit = 20;
      const page = 10;
      emailTemplateRepositoryMock.findAndCount = jest
        .fn()
        .mockReturnValue([[emailTemplateEntity], 1]);
      expect(
        await emailTemplateService.findAllTemplates(where, limit, page),
      ).toEqual([[emailTemplateEntity], 1]);
      expect(emailTemplateRepositoryMock.findAndCount).toBeCalledWith({
        where,
        limit,
        page,
      });
    });

    it('should findAllTemplates properly (without extra params)', async () => {
      const where = {};
      emailTemplateRepositoryMock.findAndCount = jest
        .fn()
        .mockReturnValue([[emailTemplateEntity], 1]);
      expect(await emailTemplateService.findAllTemplates(where)).toEqual([
        [emailTemplateEntity],
        1,
      ]);
      expect(emailTemplateRepositoryMock.findAndCount).toBeCalledWith({
        where,
        limit: 10,
        page: 0,
      });
    });
  });
  describe('getById', () => {
    it('should getById properly', async () => {
      emailTemplateRepositoryMock.findOne = jest
        .fn()
        .mockReturnValue(emailTemplateEntity);
      expect(
        await emailTemplateService.getById(emailTemplateEntity.id),
      ).toEqual(emailTemplateEntity);

      expect(emailTemplateRepositoryMock.findOne).toBeCalledWith(
        emailTemplateEntity.id,
      );
    });
  });
  describe('addTemplate', () => {
    it('should addTemplate properly', async () => {
      await emailTemplateService.addTemplate(emailTemplateDto);
      expect(emailTemplateRepositoryMock.save).toBeCalledWith({
        locales: [
          {
            contents: 'some contents',
            locale: 'pl_PL',
            subject: 'some subject',
          },
        ],
        name: 'potato',
      });
    });
  });
  describe('saveTemplate', () => {
    it('should saveTemplate properly', async () => {
      await emailTemplateService.saveTemplate(emailTemplateEntity);
      expect(emailTemplateRepositoryMock.save).toBeCalledWith(
        emailTemplateEntity,
      );
    });
  });
  describe('saveTemplateLocale', () => {
    it('should saveTemplateLocale properly', async () => {
      await emailTemplateService.saveTemplateLocale(emailTemplateEntity.id, {
        locale: 'de_ED',
        subject: 'eeee',
        contents: 'asdfadsa',
      });
      expect(emailTemplateLocaleRepositoryMock.save).toBeCalledWith({
        contents: 'asdfadsa',
        locale: 'de_ED',
        subject: 'eeee',
        template: emailTemplateEntity,
      });
    });
    it('should saveTemplateLocale throw exception not exists', async () => {
      emailTemplateRepositoryMock.findOne = jest.fn().mockReturnValue(null);

      await expect(
        emailTemplateService.saveTemplateLocale(emailTemplateEntity.id, {
          locale: 'de_ED',
          subject: 'eeee',
          contents: 'asdfadsa',
        }),
      ).rejects.toThrowError(
        new DomainException('Email template does not exists'),
      );

      expect(emailTemplateLocaleRepositoryMock.save).not.toBeCalled();
    });
  });
  describe('deleteTemplateById', () => {
    it('should deleteTemplateById properly', async () => {
      emailTemplateRepositoryMock.findOne = jest
        .fn()
        .mockReturnValue(emailTemplateEntity);
      await emailTemplateService.deleteTemplateById(emailTemplateEntity.id);
      expect(emailTemplateRepositoryMock.findOne).toBeCalledWith(
        emailTemplateEntity.id,
      );
      expect(emailTemplateRepositoryMock.remove).toBeCalledWith(
        emailTemplateEntity,
      );
    });
    it('should deleteTemplateById throw exception does not exists', async () => {
      emailTemplateRepositoryMock.findOne = jest.fn().mockReturnValue(null);
      await expect(
        emailTemplateService.deleteTemplateById(emailTemplateEntity.id),
      ).rejects.toThrowError(
        new DomainException('Email template does not exists'),
      );
      expect(emailTemplateRepositoryMock.findOne).toBeCalledWith(
        emailTemplateEntity.id,
      );
      expect(emailTemplateRepositoryMock.remove).not.toBeCalled();
    });
  });
  describe('deleteTemplateLocaleById', () => {
    it('should deleteTemplateLocaleById properly', async () => {
      emailTemplateRepositoryMock.findOne = jest
        .fn()
        .mockReturnValue(emailTemplateEntity);
      await emailTemplateService.deleteTemplateLocaleById(
        emailTemplateEntity.id,
        emailTemplateEntity.locales[0].locale,
      );
      expect(emailTemplateRepositoryMock.findOne).toBeCalledWith(
        emailTemplateEntity.id,
      );
      expect(emailTemplateLocaleRepositoryMock.remove).toBeCalledWith(
        emailTemplateEntity.locales[0],
      );
    });

    it('should deleteTemplateLocaleById throw exception not found', async () => {
      emailTemplateRepositoryMock.findOne = jest.fn().mockReturnValue(null);
      await expect(
        emailTemplateService.deleteTemplateLocaleById(
          emailTemplateEntity.id,
          emailTemplateEntity.locales[0].locale,
        ),
      ).rejects.toThrowError(
        new DomainException('Email template does not exists'),
      );
      expect(emailTemplateRepositoryMock.findOne).toBeCalledWith(
        emailTemplateEntity.id,
      );
      expect(emailTemplateLocaleRepositoryMock.remove).not.toBeCalled();
    });

    it('should deleteTemplateLocaleById throw exception localenot found', async () => {
      emailTemplateRepositoryMock.findOne = jest
        .fn()
        .mockReturnValue(emailTemplateEntity);
      await expect(
        emailTemplateService.deleteTemplateLocaleById(
          emailTemplateEntity.id,
          'de+ff',
        ),
      ).rejects.toThrowError(
        new DomainException('Email template locale does not exists'),
      );
      expect(emailTemplateRepositoryMock.findOne).toBeCalledWith(
        emailTemplateEntity.id,
      );
      expect(emailTemplateLocaleRepositoryMock.remove).not.toBeCalled();
    });
  });
});
