import { Controller, Get, Post, Put, Delete, Param, Query, Body, UseGuards, ValidationPipe } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { QueryProjectsDto } from './dto/query-projects.dto';

@Controller('projects')
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(
    @CurrentUser('id') userId: string,
    @Query(ValidationPipe) query: QueryProjectsDto,
  ) {
    return this.projectsService.findAll(userId, query);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  getStats(@CurrentUser('id') userId: string) {
    return this.projectsService.getStats(userId);
  }

  @Get('recent')
  @UseGuards(JwtAuthGuard)
  getRecent(@CurrentUser('id') userId: string) {
    return this.projectsService.getRecentProjects(userId);
  }

  @Get('favorites')
  @UseGuards(JwtAuthGuard)
  getFavorites(@CurrentUser('id') userId: string) {
    return this.projectsService.getFavorites(userId);
  }

  @Get('template-recommendations')
  @UseGuards(JwtAuthGuard)
  getTemplateRecommendations(
    @CurrentUser('id') userId: string,
    @Query('projectType') projectType?: string,
  ) {
    return this.projectsService.getTemplateRecommendations(userId, projectType);
  }

  @Get('shared/:sharedLink')
  findBySharedLink(@Param('sharedLink') sharedLink: string) {
    return this.projectsService.findBySharedLink(sharedLink);
  }

  @Get(':id')
  findById(@Param('id') id: string, @CurrentUser('id') userId: string | undefined) {
    return this.projectsService.findById(id, userId);
  }

  @Post()
  create(
    @CurrentUser('id') userId: string | undefined,
    @Body(ValidationPipe) body: CreateProjectDto,
  ) {
    if (body.prompt && !body.title) {
      return this.projectsService.createWithAi(userId, body);
    }
    return this.projectsService.create(userId, body);
  }

  @Post('create-with-ai')
  createWithAi(
    @CurrentUser('id') userId: string | undefined,
    @Body(ValidationPipe) body: CreateProjectDto,
  ) {
    return this.projectsService.createWithAi(userId, body);
  }

  @Post('batch-delete')
  @UseGuards(JwtAuthGuard)
  batchRemove(
    @CurrentUser('id') userId: string,
    @Body('ids') ids: string[],
  ) {
    return this.projectsService.batchRemove(ids, userId);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body(ValidationPipe) body: UpdateProjectDto,
  ) {
    return this.projectsService.update(id, userId, body);
  }

  @Put(':id/content')
  @UseGuards(JwtAuthGuard)
  saveContent(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() content: any,
  ) {
    return this.projectsService.saveContent(id, userId, content);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.projectsService.remove(id, userId);
  }

  @Post(':id/favorite')
  @UseGuards(JwtAuthGuard)
  toggleFavorite(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.projectsService.toggleFavorite(id, userId);
  }

  @Post(':id/duplicate')
  @UseGuards(JwtAuthGuard)
  duplicate(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.projectsService.duplicate(id, userId);
  }
}
