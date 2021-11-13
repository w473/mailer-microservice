import { Column, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EmailTemplateEntity } from './email-template.entity';
import { EmailRecipientEntity } from './email-recipient.entity';


export class EmailEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(() => EmailRecipientEntity, (recepients) => recepients.mail)
    recepients: EmailRecipientEntity[];

    @Column({ 'length': 1024 })
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