import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { EmailSendRequestDto } from '../dtos/email-send-request.dto';
import { EmailService } from '../../application/services/email.service';
import { EmailDto, fromEmailEntities } from '../dtos/email.dto';
import { ItemsWithTotalResponseDto } from '../dtos/items-with-total-response.dto';
import { HasRole } from '../decorators/has-role.decorator';
import { ApiCreatedResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ApiOkResponse } from '@nestjs/swagger/dist/decorators/api-response.decorator';

@Controller()
@ApiTags('emails')
export class EmailsController {
  constructor(private readonly emailService: EmailService) {}

  @Post()
  @HasRole('ADMIN', 'SYS')
  @ApiCreatedResponse()
  async send(@Body() emailSendRequestDto: EmailSendRequestDto): Promise<void> {
    return this.emailService.send(emailSendRequestDto);
  }

  @Get()
  @HasRole('ADMIN')
  @ApiOkResponse({
    description: 'Response with all found emails and total number',
  })
  @ApiQuery({ name: 'email_id', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'page', required: false })
  async getAll(
    @Query('email_id') emailId?: number,
    @Query('limit') limit: number = 10,
    @Query('page') page: number = 0,
  ): Promise<ItemsWithTotalResponseDto<EmailDto>> {
    const where: any = {};
    if (emailId) {
      where.emailId = emailId;
    }
    const entities = await this.emailService.findAllBy({}, limit, page);

    return { items: fromEmailEntities(entities[0]), total: entities[1] };
  }
}
