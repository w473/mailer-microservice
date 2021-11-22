import { Test } from '@nestjs/testing';
import { MainModule } from 'src/main.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailRepository } from 'src/infrastructure/db/repositories/email.repository';
import { EmailEntity } from 'src/infrastructure/db/entities/email.entity';
import { emailEntity3 } from '../__mockdata__/emails';
import { beforeEachHelper } from './integration-test.helper';

describe('EmailRepository', () => {
  let emailRepository: EmailRepository;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [MainModule, TypeOrmModule.forFeature([EmailEntity])],
      providers: [EmailRepository],
    }).compile();

    emailRepository = await module.get(EmailRepository);
  });

  beforeEach(beforeEachHelper);

  it(`save and find`, async () => {
    await emailRepository.save(emailEntity3);
    const emailEntity = await emailRepository.findOne(emailEntity3.id);
    expect(emailEntity).toEqual({
      id: emailEntity3.id,
      contents: 'some uuu',
      error: null,
      recipients: [
        {
          id: emailEntity.recipients[0].id,
          emailAddress: 'some@email.de',
          name: 'tomato',
          userId: '5ebd704d-28a9-4dcc-8fa3-c350137aab38',
        },
      ],
      sent: null,
      subject: 'some eeee pott',
    });
  });

  it(`findAndCount`, async () => {
    await emailRepository.save(emailEntity3);
    const ret = await emailRepository.findAndCount({
      where: {},
      limit: 10,
      page: 0,
    });
    expect(ret).toEqual([
      [
        {
          contents: 'some uuu',
          error: null,
          id: ret[0][0].id,
          sent: null,
          subject: 'some eeee pott',
        },
      ],
      1,
    ]);
  });
});
