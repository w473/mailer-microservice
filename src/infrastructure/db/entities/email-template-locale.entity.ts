import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  ManyToOne,
} from 'typeorm';
import { EmailTemplateEntity } from './email-template.entity';

@Entity('email_templates_locale')
@Unique(['locale', 'template'])
export class EmailTemplateLocaleEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ length: 8 })
  locale?: string;

  @Column()
  subject?: string;

  @Column()
  contents?: string;

  @ManyToOne(() => EmailTemplateEntity, (template) => template.locales, {
    nullable: false,
  })
  template?: EmailTemplateEntity;
}
