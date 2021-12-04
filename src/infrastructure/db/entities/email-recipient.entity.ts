import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EmailEntity } from './email.entity';

@Entity('emails_recipients')
export class EmailRecipientEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @ManyToOne(() => EmailEntity, (email) => email.recipients, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  email: EmailEntity;

  @Column({ type: 'uuid', nullable: true })
  userId?: string;

  @Column({ length: 1024 })
  emailAddress: string;

  @Column({ length: 1024, nullable: true })
  name: string;
}
