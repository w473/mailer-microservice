import { QueryFailedError, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailTemplateEntity } from '../../infrastructure/db/entities/email-template.entity';



@Injectable()
export class EmailTemplateService{

    constructor(
    @InjectRepository(EmailTemplateEntity)
    private emailTemplateRepository: Repository<EmailTemplateEntity>
  ) {}

}