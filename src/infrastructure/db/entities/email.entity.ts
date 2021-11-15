import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EmailTemplateEntity } from './email-template.entity';
import { EmailRecipientEntity } from './email-recipient.entity';

@Entity('emails')
export class EmailEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(
    () => EmailRecipientEntity,
    (recipients) => recipients.emailAddress,
  )
  recipients: EmailRecipientEntity[];

  @Column({ length: 1024 })
  subject: string;

  @Column()
  contents: string;

  @Column({ nullable: true })
  sent: Date | null;

  @Column({ nullable: true })
  error: string | null;

  @ManyToOne(() => EmailTemplateEntity, { nullable: false, cascade: true })
  template: EmailTemplateEntity;
}
