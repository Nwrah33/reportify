import { Controller, Post, Delete, Get, Param, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('files')
@UseGuards(JwtAuthGuard)
export class FilesController {
  constructor(private filesService: FilesService) {}

  @Post('upload/:projectId')
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @UploadedFile() file: Express.Multer.File,
    @Param('projectId') projectId: string,
  ) {
    return this.filesService.uploadFile(file, projectId);
  }

  @Get('project/:projectId')
  getProjectFiles(@Param('projectId') projectId: string, @CurrentUser('id') userId: string) {
    return this.filesService.getProjectFiles(projectId, userId);
  }

  @Delete(':fileId')
  delete(@Param('fileId') fileId: string, @CurrentUser('id') userId: string) {
    return this.filesService.deleteFile(fileId, userId);
  }
}
