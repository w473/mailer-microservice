import { IsEmail, Length, IsUUID } from 'class-validator';

export class RecipientDto{
    @IsUUID()
    userId: string;

    @IsEmail()
    email: string;

    @Length(5, 256)
    name: string;
}