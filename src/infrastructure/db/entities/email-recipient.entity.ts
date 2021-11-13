import { Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EmailEntity } from './email.entity';

export class EmailRecipientEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @ManyToOne(() => EmailEntity, (mail) => mail.recipients)
  mail?: EmailEntity;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ length: 1024 })
  email: string;

  @Column({ length: 8 })
  name: string;
}
