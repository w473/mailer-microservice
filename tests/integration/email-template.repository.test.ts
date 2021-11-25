import { Test } from '@nestjs/testing';
import { EmailTemplateRepository } from 'src/infrastructure/db/repositories/email-template.repository';
import { MainModule } from 'src/main.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailTemplateEntity } from 'src/infrastructure/db/entities/email-template.entity';
import { NotFoundException } from '@nestjs/common';
import { DuplicateException } from 'src/domain/exceptions/duplicate.exception';
import { beforeEachHelper } from './integration-test.helper';

describe('EmailTemplateRepository', () => {
  let emailTemplateRepository: EmailTemplateRepository;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [MainModule, TypeOrmModule.forFeature([EmailTemplateEntity])],
      providers: [EmailTemplateRepository],
    }).compile();

    emailTemplateRepository = await module.get(EmailTemplateRepository);
  });

  beforeEach(beforeEachHelper);

  it(`findOne`, async () => {
    expect(await emailTemplateRepository.findOne(1)).toEqual({
      id: 1,
      locales: [
        {
          contents:
            'Hi<br> please confirm you email by clicking <a href="{{activationURL}}">here</a>',
          id: 1,
          locale: 'en_US',
          subject: 'Hello {{recipientName}}',
        },
        {
          contents:
            'Hej<br> potwierdź swój email klikając <a href="{{activationURL}}">tutaj</a>',
          id: 2,
          locale: 'pl_PL',
          subject: 'Witaj {{recipientName}}',
        },
      ],
      name: 'New user',
    });
  });

  it(`getTemplateByNameAndLocale`, async () => {
    expect(
      await emailTemplateRepository.getTemplateByNameAndLocale(
        'New user',
        'pl_PL',
        'en_US',
      ),
    ).toEqual({
      id: 1,
      locales: [
        {
          contents:
            'Hi<br> please confirm you email by clicking <a href="{{activationURL}}">here</a>',
          id: 1,
          locale: 'en_US',
          subject: 'Hello {{recipientName}}',
        },
        {
          contents:
            'Hej<br> potwierdź swój email klikając <a href="{{activationURL}}">tutaj</a>',
          id: 2,
          locale: 'pl_PL',
          subject: 'Witaj {{recipientName}}',
        },
      ],
      name: 'New user',
    });
  });

  it(`getTemplateByNameAndLocale throws exception`, async () => {
    await expect(
      emailTemplateRepository.getTemplateByNameAndLocale(
        'sdf',
        'pl_PL',
        'en_US',
      ),
    ).rejects.toThrowError(
      new NotFoundException('Requested locale and fallback does not exists'),
    );
  });

  it(`findAndCount`, async () => {
    expect(
      await emailTemplateRepository.findAndCount({
        where: null,
        limit: 10,
        page: 0,
      }),
    ).toEqual([
      [
        {
          id: 1,
          locales: [
            {
              contents:
                'Hi<br> please confirm you email by clicking <a href="{{activationURL}}">here</a>',
              id: 1,
              locale: 'en_US',
              subject: 'Hello {{recipientName}}',
            },
            {
              contents:
                'Hej<br> potwierdź swój email klikając <a href="{{activationURL}}">tutaj</a>',
              id: 2,
              locale: 'pl_PL',
              subject: 'Witaj {{recipientName}}',
            },
          ],
          name: 'New user',
        },
        {
          id: 2,
          locales: [
            {
              contents:
                'Hi<br> please confirm you email by clicking <a href="{{activationURL}}">here</a>',
              id: 3,
              locale: 'en_US',
              subject: 'Email Activation',
            },
            {
              contents:
                'Hej<br> potwierdź swój email klikając <a href="{{activationURL}}">tutaj</a>',
              id: 4,
              locale: 'pl_PL',
              subject: 'Aktywacja email',
            },
          ],
          name: 'User email changed activate',
        },
      ],
      2,
    ]);
  });

  it(`save error duplicate`, async () => {
    const emailTemplateEntity = new EmailTemplateEntity();
    emailTemplateEntity.name = 'User email changed activate';
    await expect(
      emailTemplateRepository.save(emailTemplateEntity),
    ).rejects.toThrowError(
      new DuplicateException("You can't use this template name"),
    );
  });

  it(`remove`, async () => {
    const emailTemplateEntity = new EmailTemplateEntity();
    emailTemplateEntity.name = 'asdte';

    await emailTemplateRepository.save(emailTemplateEntity);
    expect(await emailTemplateRepository.remove(emailTemplateEntity)).toEqual(
      undefined,
    );
  });
});
