import { Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EmailEntity } from './email.entity';

export class EmailRecipientEntity {
    @PrimaryGeneratedColumn()
    id?: number;

    @ManyToOne(() => Mail, (mail) => mail.recepients)
    mail?: EmailEntity;

    @Column({ 'type': 'uuid' })
    userId: string;

    @Column({ 'length': 1024 })
    email: string;

    @Column({ 'length': 8 })
    name: string;
}