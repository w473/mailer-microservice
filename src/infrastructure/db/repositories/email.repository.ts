import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailRepositoryInterface } from 'src/domain/repositories/email.repository.interface';
import { EmailEntity } from 'src/infrastructure/db/entities/email.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailRepository implements EmailRepositoryInterface {
  constructor(
    @InjectRepository(EmailEntity)
    private readonly emailRepository: Repository<EmailEntity>,
  ) {}

  async findOne(emailId: number): Promise<EmailEntity> {
    return this.emailRepository.findOne(emailId, {
      relations: ['recipients'],
    });
  }

  async save(email: EmailEntity): Promise<void> {
    await this.emailRepository.save(email);
  }

  async findAndCount({
    where,
    limit,
    page,
  }: {
    where: any;
    limit: number;
    page: number;
  }): Promise<[EmailEntity[], number]> {
    return this.emailRepository.findAndCount({
      where,
      skip: limit * page,
      take: limit,
    });
  }
}
