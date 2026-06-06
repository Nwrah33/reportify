import { Controller, Get, Post, Delete, Param, Query, Body, UseGuards } from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('templates')
export class TemplatesController {
  constructor(private templatesService: TemplatesService) {}

  @Get()
  findAll(
    @Query('category') category?: string,
    @Query('search') search?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.templatesService.findAll(category, search, +page, +limit);
  }

  @Get('categories')
  getCategories() {
    return this.templatesService.getCategories();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.templatesService.findById(id);
  }

  @Post('favorites/:id')
  @UseGuards(JwtAuthGuard)
  saveTemplate(@CurrentUser('id') userId: string, @Param('id') templateId: string) {
    return this.templatesService.saveTemplate(userId, templateId);
  }

  @Delete('favorites/:id')
  @UseGuards(JwtAuthGuard)
  unsaveTemplate(@CurrentUser('id') userId: string, @Param('id') templateId: string) {
    return this.templatesService.unsaveTemplate(userId, templateId);
  }

  @Get('favorites/list')
  @UseGuards(JwtAuthGuard)
  getSavedTemplates(@CurrentUser('id') userId: string) {
    return this.templatesService.getSavedTemplates(userId);
  }
}
