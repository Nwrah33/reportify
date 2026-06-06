import { Controller, Get, Post, Param, Query, UseGuards } from '@nestjs/common';
import { ExportService } from './export.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('export')
@UseGuards(JwtAuthGuard)
export class ExportController {
  constructor(private exportService: ExportService) {}

  @Post(':projectId')
  exportProject(
    @Param('projectId') projectId: string,
    @CurrentUser('id') userId: string,
    @Query('format') format: string,
  ) {
    return this.exportService.exportProject(projectId, userId, format);
  }

  @Get('history')
  getHistory(@CurrentUser('id') userId: string) {
    return this.exportService.getExportHistory(userId);
  }
}
