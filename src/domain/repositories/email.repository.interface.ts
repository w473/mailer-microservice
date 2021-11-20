import { EmailEntity } from 'src/infrastructure/db/entities/email.entity';

export interface EmailRepositoryInterface {
  findOne(emailId: number): Promise<EmailEntity>;

  save(email: EmailEntity): Promise<void>;

  findAndCount({
    where,
    limit,
    page,
  }: {
    where: any;
    limit: number;
    page: number;
  }): Promise<[EmailEntity[], number]>;
}
