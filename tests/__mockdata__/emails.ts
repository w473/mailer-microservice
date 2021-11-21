import { EmailSendRequestDto } from 'src/handler/dtos/email-send-request.dto';
import { emailTemplateEntity } from './templates';

export const emailSendRequestDto: EmailSendRequestDto = {
  templateName: 'potato',
  locale: 'pl_PL',
  recipient: {
    userId: '5ebd704d-28a9-4dcc-8fa3-c350137aab38',
    email: 'some@email.de',
    name: 'tomato',
  },
  variables: {
    variableUno: 'pott',
  },
};

export const emailEntity = {
  contents: 'some Contents',
  id: 123,
  recipients: [
    {
      email: null,
      emailAddress: 'some@email.de',
      name: 'tomato',
      userId: '5ebd704d-28a9-4dcc-8fa3-c350137aab38',
    },
  ],
  subject: 'some Subject pott',
  template: emailTemplateEntity,
  sent: null,
  error: null,
};

export const emailEntity2 = {
  contents: 'some uuu',
  id: 123,
  recipients: [
    {
      email: null,
      emailAddress: 'some@email.de',
      name: 'tomato',
      userId: '5ebd704d-28a9-4dcc-8fa3-c350137aab38',
    },
  ],
  subject: 'some eeee pott',
  template: emailTemplateEntity,
};
