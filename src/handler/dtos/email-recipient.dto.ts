import { EmailRecipientEntity } from '../../infrastructure/db/entities/email-recipient.entity';

export interface EmailRecipientDto {
  userId: string;
  email: string;
  name: string;
}

const fromEmailRecipientEntity = (
  emailRecipientEntity: EmailRecipientEntity,
): EmailRecipientDto => {
  return {
    userId: emailRecipientEntity.userId,
    email: emailRecipientEntity.emailAddress,
    name: emailRecipientEntity.name,
  };
};

export const fromEmailRecipientEntities = (
  emailRecipientEntities: EmailRecipientEntity[],
): EmailRecipientDto[] => {
  return emailRecipientEntities.map((emailRecipientEntity) => {
    return fromEmailRecipientEntity(emailRecipientEntity);
  });
};
