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
      expect(emailTemplateRepositoryMock.save).toBeCalledWith(emailTemplateDto);
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
      await emailTemplateService.saveTemplateLocale(emailTemplateEntity, {
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
  });

  describe('deleteTemplateById', () => {
    it('should deleteTemplateById properly', async () => {
      emailTemplateRepositoryMock.findOne = jest
        .fn()
        .mockReturnValue(emailTemplateEntity);
      await emailTemplateService.deleteTemplate(emailTemplateEntity);
      expect(emailTemplateRepositoryMock.remove).toBeCalledWith(
        emailTemplateEntity,
      );
    });
  });

  describe('deleteTemplateLocaleById', () => {
    it('should deleteTemplateLocaleById properly', async () => {
      await emailTemplateService.deleteTemplateLocale(
        emailTemplateEntity,
        emailTemplateEntity.locales[0].locale,
      );
      expect(emailTemplateLocaleRepositoryMock.remove).toBeCalledWith(
        emailTemplateEntity.locales[0],
      );
    });

    it('should deleteTemplateLocaleById throw exception localenot found', async () => {
      await expect(
        emailTemplateService.deleteTemplateLocale(emailTemplateEntity, 'de+ff'),
      ).rejects.toThrowError(
        new DomainException('Template locale does not exists'),
      );
      expect(emailTemplateLocaleRepositoryMock.remove).not.toBeCalled();
    });
  });
});
