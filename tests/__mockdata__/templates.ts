import { EmailTemplateEntity } from 'src/infrastructure/db/entities/email-template.entity';
import { EmailTemplateDto } from 'src/handler/dtos/email-template.dto';

export const emailTemplateEntity: EmailTemplateEntity = {
  id: 666,
  name: 'potato',
  locales: [
    {
      id: 555,
      locale: 'pl_PL',
      subject: 'some Subject {{variableUno}}',
      contents: 'some Contents',
    },
    {
      id: 999,
      locale: 'en_US',
      subject: 'some eeee {{variableUno}}',
      contents: 'some uuu',
    },
  ],
};

export const emailTemplateDto: EmailTemplateDto = {
  name: 'potato',
  locales: [
    {
      locale: 'pl_PL',
      subject: 'some subject',
      contents: 'some contents some contents some contents some contents',
    },
  ],
};
