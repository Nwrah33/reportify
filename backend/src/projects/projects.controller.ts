import { Controller, Get, Post, Put, Delete, Param, Query, Body, UseGuards } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Get()
  findAll(
    @CurrentUser('id') userId: string,
    @Query('status') status?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.projectsService.findAll(userId, status, +page, +limit);
  }

  @Get('stats')
  getStats(@CurrentUser('id') userId: string) {
    return this.projectsService.getStats(userId);
  }

  @Get('recent')
  getRecent(@CurrentUser('id') userId: string) {
    return this.projectsService.getRecentProjects(userId);
  }

  @Get(':id')
  findById(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.projectsService.findById(id, userId);
  }

  @Post()
  create(@CurrentUser('id') userId: string, @Body() body: any) {
    return this.projectsService.create(userId, body);
  }

  @Put(':id')
  update(@Param('id') id: string, @CurrentUser('id') userId: string, @Body() body: any) {
    return this.projectsService.update(id, userId, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.projectsService.remove(id, userId);
  }

  @Post(':id/favorite')
  toggleFavorite(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.projectsService.toggleFavorite(id, userId);
  }

  @Post(':id/duplicate')
  duplicate(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.projectsService.duplicate(id, userId);
  }
}
