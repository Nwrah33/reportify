import { Controller, Get, Post, Param, Query, Body, UseGuards, Res, ValidationPipe } from '@nestjs/common';
import { Response } from 'express';
import { ExportService } from './export.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ExportOptionsDto, BatchExportDto } from './dto/export-options.dto';

@Controller('export')
export class ExportController {
  constructor(private exportService: ExportService) {}

  @Post(':projectId')
  @UseGuards(JwtAuthGuard)
  exportProject(
    @Param('projectId') projectId: string,
    @CurrentUser('id') userId: string,
    @Query('format') format: string,
    @Body(ValidationPipe) options?: ExportOptionsDto,
  ) {
    return this.exportService.exportProject(projectId, userId, format, options);
  }

  @Post('batch')
  @UseGuards(JwtAuthGuard)
  batchExport(
    @CurrentUser('id') userId: string,
    @Body(ValidationPipe) body: BatchExportDto,
  ) {
    return this.exportService.batchExport(body.projectIds, userId, body.format, body.options);
  }

  @Get('history')
  @UseGuards(JwtAuthGuard)
  getHistory(
    @CurrentUser('id') userId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.exportService.getExportHistory(userId, +page, +limit);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  getStats(@CurrentUser('id') userId: string) {
    return this.exportService.getExportStats(userId);
  }

  @Get('download/:fileName')
  downloadFile(@Param('fileName') fileName: string, @Res() res: Response) {
    return this.exportService.downloadFile(fileName, res);
  }
}
