import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Unique,
} from 'typeorm';
import { EmailTemplateLocaleEntity } from './email-template-locale.entity';

@Entity('templates')
@Unique(['name'])
export class EmailTemplateEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name?: string;

  @OneToMany(() => EmailTemplateLocaleEntity, (locale) => locale.template)
  locales?: EmailTemplateLocaleEntity[];
}
