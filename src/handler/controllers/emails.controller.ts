import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';

import { EmailSendRequestDto } from '../dtos/email-send-request.dto';
import { EmailService } from '../../application/services/email.service';
import { EmailDto, fromEmailEntities } from '../dtos/email.dto';
import { ItemsWithTotalResponseDto } from '../dtos/items-with-total-response.dto';
import { HasRole } from '../decorators/has-role.decorator';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';

@UseGuards(JwtAuthGuard)
@Controller()
@ApiTags('emails')
export class EmailsController {
  constructor(private readonly emailService: EmailService) {}

  @Post()
  @HasRole('ADMIN', 'SYS')
  async send(@Body() emailSendRequestDto: EmailSendRequestDto): Promise<void> {
    return this.emailService.send(emailSendRequestDto);
  }

  @Get()
  @HasRole('ADMIN')
  async getAll(
    @Query('email-id') emailId?: number,
    @Query('limit') limit?: number,
    @Query('page') page?: number,
  ): Promise<ItemsWithTotalResponseDto<EmailDto>> {
    const where: any = {};
    if (emailId) {
      where.emailId = emailId;
    }
    const entities = await this.emailService.findAllBy({}, limit, page);

    return { items: fromEmailEntities(entities[0]), total: entities[1] };
  }
}
