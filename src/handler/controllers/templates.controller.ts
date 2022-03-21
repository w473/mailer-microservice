import { EmailTemplateService } from '../../application/services/email-template.service';
import {
  Controller,
  Get,
  Query,
  Param,
  NotFoundException,
  Post,
  Body,
  Patch,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ItemsWithTotalResponseDto } from '../dtos/items-with-total-response.dto';
import {
  EmailTemplateDto,
  fromEmailTemplateEntities,
  fromEmailTemplateEntity,
} from '../dtos/email-template.dto';
import { NameDto } from '../dtos/name.dto';
import { EmailTemplateLocaleDto } from '../dtos/email-template-locale.dto';
import { ApiOkResponse } from '@nestjs/swagger/dist/decorators/api-response.decorator';
import { ParseIntPipeOrDefault } from 'src/handler/pipes/parse-int-pipe-or-default';
import { ParseLocalePipe } from 'src/handler/pipes/parse-locale-pipe';
import { EmailTemplateNewDto } from 'src/handler/dtos/email-template-new.dto';
import { NotFoundException as LocalNotFoundException } from 'src/domain/exceptions/not-found.exception';

@Controller('api/v1/templates')
@ApiTags('templates')
export class TemplatesController {
  constructor(private readonly emailTemplateService: EmailTemplateService) {}

  @Get()
  @ApiOkResponse({
    description: 'Response with all found templates and total number',
  })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'page', required: false })
  async getAllTemplates(
    @Query('limit', new ParseIntPipeOrDefault({ def: 10 })) limit: number,
    @Query('page', new ParseIntPipeOrDefault({ def: 0 })) page: number,
  ): Promise<ItemsWithTotalResponseDto<EmailTemplateDto>> {
    const templates = await this.emailTemplateService.findAllTemplates(
      {},
      limit,
      page,
    );
    return {
      items: fromEmailTemplateEntities(templates[0]),
      total: templates[1],
    };
  }

  @Get(':templateId')
  @ApiOkResponse({ type: EmailTemplateDto })
  @ApiNotFoundResponse({ description: 'Template does not exist' })
  async findOneById(
    @Param('templateId', ParseIntPipe) templateId: number,
  ): Promise<EmailTemplateDto> {
    const emailTemplate = await this.emailTemplateService.getById(templateId);
    if (emailTemplate) {
      return fromEmailTemplateEntity(emailTemplate);
    }
    throw new NotFoundException('Template does not exist');
  }

  @Post()
  async addTemplate(
    @Body() emailTemplateDto: EmailTemplateNewDto,
  ): Promise<void> {
    return this.emailTemplateService.addTemplate(emailTemplateDto);
  }

  @Patch(':templateId')
  @ApiOkResponse({ description: 'Template has been updated' })
  @ApiNotFoundResponse({ description: 'Template does not exist' })
  async updateTemplateName(
    @Param('templateId', ParseIntPipe) templateId: number,
    @Body() nameDto: NameDto,
  ): Promise<void> {
    const template = await this.emailTemplateService.getById(templateId);
    if (!template) {
      throw new NotFoundException('Template does not exists');
    }
    template.name = nameDto.name;
    await this.emailTemplateService.saveTemplate(template);
  }

  @Patch(':templateId/locale')
  @ApiCreatedResponse({ description: 'Template locale has been set' })
  async setTemplateLocale(
    @Param('templateId', ParseIntPipe) templateId: number,
    @Body() templateLocaleDto: EmailTemplateLocaleDto,
  ): Promise<void> {
    const emailTemplateEntity = await this.emailTemplateService.getById(
      templateId,
    );
    if (!emailTemplateEntity) {
      throw new NotFoundException('Template does not exists');
    }
    await this.emailTemplateService.saveTemplateLocale(
      emailTemplateEntity,
      templateLocaleDto,
    );
  }

  @Delete(':templateId')
  @ApiCreatedResponse({ description: 'Template has been deleted' })
  async deleteTemplate(
    @Param('templateId', ParseIntPipe) templateId: number,
  ): Promise<void> {
    const emailTemplateEntity = await this.emailTemplateService.getById(
      templateId,
    );
    if (!emailTemplateEntity) {
      throw new NotFoundException('Template does not exists');
    }
    return this.emailTemplateService.deleteTemplate(emailTemplateEntity);
  }

  @Delete(':templateId/:locale')
  @ApiCreatedResponse({ description: 'Template locale has been updated' })
  async deleteTemplateLocale(
    @Param('templateId', ParseIntPipe) templateId: number,
    @Param('locale', ParseLocalePipe) locale: string,
  ): Promise<void> {
    const emailTemplateEntity = await this.emailTemplateService.getById(
      templateId,
    );
    if (!emailTemplateEntity) {
      throw new NotFoundException('Email template does not exists');
    }
    try {
      return await this.emailTemplateService.deleteTemplateLocale(
        emailTemplateEntity,
        locale,
      );
    } catch (error) {
      if (error instanceof LocalNotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
}
