import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class ExportService {
  constructor(private prisma: PrismaService) {}

  async exportProject(projectId: string, userId: string, format: string) {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, userId },
      include: { template: true },
    });

    if (!project) throw new BadRequestException('المشروع غير موجود');

    // In production, use libraries like puppeteer (PDF), docx (Word), pptxgenjs (PowerPoint), sharp (images)
    const exportFormats: Record<string, string> = {
      pdf: 'application/pdf',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      png: 'image/png',
      jpg: 'image/jpeg',
    };

    if (!exportFormats[format]) throw new BadRequestException('صيغة التصدير غير مدعومة');

    // Return export URL (in production, generate the file and return download link)
    return {
      format,
      mimeType: exportFormats[format],
      fileName: `${project.title}.${format}`,
      downloadUrl: `/api/export/download/${project.id}/${format}`,
      projectId: project.id,
    };
  }

  async getExportHistory(userId: string) {
    return this.prisma.project.findMany({
      where: { userId, status: 'COMPLETED' },
      select: {
        id: true,
        title: true,
        projectType: true,
        updatedAt: true,
        fileUrl: true,
      },
      orderBy: { updatedAt: 'desc' },
      take: 50,
    });
  }
}
