import { Test } from '@nestjs/testing';
import { MainModule } from 'src/main.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { beforeEachHelper } from './integration-test.helper';
import { EmailTemplateLocaleEntity } from 'src/infrastructure/db/entities/email-template-locale.entity';
import { EmailTemplateLocaleRepository } from 'src/infrastructure/db/repositories/email-template-locale.repository';

describe('EmailTemplateLocaleRepository', () => {
  let emailTemplateLocaleRepository: EmailTemplateLocaleRepository;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        MainModule,
        TypeOrmModule.forFeature([EmailTemplateLocaleEntity]),
      ],
      providers: [EmailTemplateLocaleRepository],
    }).compile();

    emailTemplateLocaleRepository = await module.get(
      EmailTemplateLocaleRepository,
    );
  });

  beforeEach(beforeEachHelper);

  it(`findOne`, async () => {
    const toSave = {
      template: {
        id: 1,
      },
      locale: 'fr_FR',
      subject: 'asdads',
      contents: 'asdads',
    };
    const ret = await emailTemplateLocaleRepository.save(toSave);

    expect(ret).toEqual({ ...toSave, id: ret.id });

    await emailTemplateLocaleRepository.remove(ret);
  });
});
