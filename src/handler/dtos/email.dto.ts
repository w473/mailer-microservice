import { EmailEntity } from '../../infrastructure/db/entities/email.entity';
import {
  EmailRecipientDto,
  fromEmailRecipientEntities,
} from './email-recipient.dto';

export class EmailDto {
  id: number;
  recipients: EmailRecipientDto[];
  subject: string;
  contents: string;
  sent: Date;
}

const fromEmailEntity = (emailEntity: EmailEntity): EmailDto => {
  return {
    id: emailEntity.id,
    subject: emailEntity.subject,
    contents: emailEntity.contents,
    sent: emailEntity.sent,
    recipients: fromEmailRecipientEntities(emailEntity.recipients),
  };
};

export const fromEmailEntities = (emailEntities: EmailEntity[]): EmailDto[] => {
  return emailEntities.map((emailEntity) => {
    return fromEmailEntity(emailEntity);
  });
};
