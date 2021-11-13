import { EmailTemplateService } from '../../application/services/email-template.service';
import {
  Controller,
  Get,
  Query,
  Param,
  UseGuards,
  NotFoundException,
  Post,
  Body,
  Patch,
  Delete,
} from '@nestjs/common';
import { HasRole } from '../decorators/has-role.decorator';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { ItemsWithTotalResponseDto } from '../dtos/items-with-total-response.dto';
import {
  EmailTemplateDto,
  fromEmailTemplateEntities,
  fromEmailTemplateEntity,
} from '../dtos/email-template.dto';
import { NameDto } from '../dtos/name.dto';
import { EmailTemplateLocaleDto } from '../dtos/email-template-locale.dto';

@UseGuards(JwtAuthGuard)
@Controller('templates')
@ApiTags('templates')
export class TemplatesController {
  constructor(private readonly emailTemplateService: EmailTemplateService) {}

  @Get()
  @HasRole('ADMIN')
  async getAllTemplates(
    @Query('limit') limit?: number,
    @Query('page') page?: number,
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
  async findOneById(
    @Param('templateId') templateId: number,
  ): Promise<EmailTemplateDto> {
    const emailTemplate = await this.emailTemplateService.getById(templateId);
    if (emailTemplate) {
      return fromEmailTemplateEntity(emailTemplate);
    }
    throw new NotFoundException('Template does not exists');
  }

  @Post()
  @HasRole('ADMIN') //templateAdd
  async addTemplate(@Body() emailTemplateDto: EmailTemplateDto): Promise<void> {
    return this.emailTemplateService.addTemplate(emailTemplateDto);
  }

  @Patch(':templateId')
  @HasRole('ADMIN') //templateEdit
  async updateTemplate(
    @Param('templateId') templateId: number,
    @Body() nameDto: NameDto,
  ): Promise<void> {
    const template = await this.findOneById(templateId);
    if (!template) {
      throw new NotFoundException('Template does not exists');
    }
    template.name = nameDto.name;
    return this.emailTemplateService.saveTemplate(template);
  }

  @Patch(':templateId/locale')
  @HasRole('ADMIN') //templateEdit
  async updateTemplateLocale(
    @Param('templateId') templateId: number,
    @Body() templateLocaleDto: EmailTemplateLocaleDto,
  ): Promise<void> {
    return this.emailTemplateService.saveTemplateLocale(
      templateId,
      templateLocaleDto,
    );
  }

  @Delete(':templateId')
  @HasRole('ADMIN')
  async deleteTemplate(@Param('templateId') templateId: number): Promise<void> {
    return this.emailTemplateService.deleteTemplateById(templateId);
  }

  @Delete(':templateId/:locale')
  @HasRole('ADMIN')
  async deleteTemplateLocale(
    @Param('templateId') templateId: number,
    @Param('locale') locale: string,
  ): Promise<void> {
    return this.emailTemplateService.deleteTemplateLocaleById(
      templateId,
      locale,
    );
  }
}
