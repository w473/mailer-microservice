import { Column, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EmailTemplateEntity } from './email-template.entity';
import { EmailRecipientEntity } from './email-recipient.entity';

export class EmailEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => EmailRecipientEntity, (recipients) => recipients.mail)
  recipients: EmailRecipientEntity[];

  @Column({ length: 1024 })
  subject: string;

  @Column()
  contents: string;

  @Column()
  sent: Date;

  @Column()
  error: string;

  @ManyToOne(() => EmailTemplateEntity)
  template: EmailTemplateEntity;
}
