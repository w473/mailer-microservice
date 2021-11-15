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
import { HasRole } from '../decorators/has-role.decorator';
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
import { ParseIntPipeOrDefault } from 'src/handler/pipes/ParseIntPipeOrDefault';
import { ParseLocalePipe } from 'src/handler/pipes/ParseLocalePipe';
import { EmailTemplateNewDto } from 'src/handler/dtos/email-template-new.dto';

@Controller('templates')
@ApiTags('templates')
export class TemplatesController {
  constructor(private readonly emailTemplateService: EmailTemplateService) {}

  @Get()
  @HasRole('ADMIN')
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
  @HasRole('ADMIN')
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
  @HasRole('ADMIN')
  async addTemplate(
    @Body() emailTemplateDto: EmailTemplateNewDto,
  ): Promise<void> {
    return this.emailTemplateService.addTemplate(emailTemplateDto);
  }

  @Patch(':templateId')
  @HasRole('ADMIN')
  @ApiCreatedResponse({ description: 'Template has been updated' })
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
    return this.emailTemplateService.saveTemplate(template);
  }

  @Patch(':templateId/locale')
  @HasRole('ADMIN')
  @ApiCreatedResponse({ description: 'Template locale has been set' })
  async setTemplateLocale(
    @Param('templateId', ParseIntPipe) templateId: number,
    @Body() templateLocaleDto: EmailTemplateLocaleDto,
  ): Promise<void> {
    await this.emailTemplateService.saveTemplateLocale(
      templateId,
      templateLocaleDto,
    );
  }

  @Delete(':templateId')
  @HasRole('ADMIN')
  @ApiCreatedResponse({ description: 'Template has been deleted' })
  async deleteTemplate(
    @Param('templateId', ParseIntPipe) templateId: number,
  ): Promise<void> {
    return this.emailTemplateService.deleteTemplateById(templateId);
  }

  @Delete(':templateId/:locale')
  @HasRole('ADMIN')
  @ApiCreatedResponse({ description: 'Template locale has been updated' })
  async deleteTemplateLocale(
    @Param('templateId', ParseIntPipe) templateId: number,
    @Param('locale', ParseLocalePipe) locale: string,
  ): Promise<void> {
    return this.emailTemplateService.deleteTemplateLocaleById(
      templateId,
      locale,
    );
  }
}
