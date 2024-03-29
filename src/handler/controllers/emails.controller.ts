import { Body, Controller, Get, Post, Query } from '@nestjs/common';

import { EmailSendRequestDto } from '../dtos/email-send-request.dto';
import { EmailService } from '../../application/services/email.service';
import { EmailDto, fromEmailEntities } from '../dtos/email.dto';
import { ItemsWithTotalResponseDto } from '../dtos/items-with-total-response.dto';
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ApiOkResponse } from '@nestjs/swagger/dist/decorators/api-response.decorator';
import { ParseIntPipeOrDefault } from 'src/handler/pipes/parse-int-pipe-or-default';

@Controller('api/v1/emails')
@ApiTags('emails')
export class EmailsController {
  constructor(private readonly emailService: EmailService) {}

  @Post()
  @ApiCreatedResponse()
  @ApiOperation({ operationId: 'sendEmail' })
  async send(@Body() emailSendRequestDto: EmailSendRequestDto): Promise<void> {
    return this.emailService.send(emailSendRequestDto);
  }

  @Get()
  @ApiOkResponse({
    description: 'Response with all found emails and total number',
  })
  @ApiQuery({ name: 'email_id', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiOperation({ operationId: 'getAllEmails' })
  async getAll(
    @Query('limit', new ParseIntPipeOrDefault({ def: 10 })) limit: number,
    @Query('page', new ParseIntPipeOrDefault({ def: 0 })) page: number,
    @Query('email_id', new ParseIntPipeOrDefault({ def: null }))
    emailId?: number,
  ): Promise<ItemsWithTotalResponseDto<EmailDto>> {
    const where: any = {};
    if (emailId) {
      where.emailId = emailId;
    }
    const entities = await this.emailService.findAllBy({}, limit, page);

    return { items: fromEmailEntities(entities[0]), total: entities[1] };
  }
}
