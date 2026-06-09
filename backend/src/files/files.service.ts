import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../common/prisma.service';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FilesService {
  private uploadDir: string;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.uploadDir = configService.get('UPLOAD_DIR', './uploads');
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadFile(file: Express.Multer.File, projectId: string) {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'image/jpeg', 'image/png', 'image/webp'];

    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('نوع الملف غير مدعوم');
    }

    const ext = path.extname(file.originalname);
    const fileName = `${uuidv4()}${ext}`;
    const filePath = path.join(this.uploadDir, fileName);

    fs.writeFileSync(filePath, file.buffer);

    const projectFile = await this.prisma.projectFile.create({
      data: {
        projectId,
        fileName: file.originalname,
        fileType: file.mimetype,
        fileSize: file.size,
        fileUrl: `/uploads/${fileName}`,
        storagePath: filePath,
      },
    });

    return projectFile;
  }

  async uploadLogo(file: Express.Multer.File, projectId: string) {
    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('يرجى رفع صورة فقط');
    }
    const ext = path.extname(file.originalname);
    const fileName = `logo-${uuidv4()}${ext}`;
    const filePath = path.join(this.uploadDir, fileName);
    fs.writeFileSync(filePath, file.buffer);

    const project = await this.prisma.project.findUnique({ where: { id: projectId } });
    if (!project) throw new BadRequestException('المشروع غير موجود');

    const existingSettings = project.settings ? JSON.parse(project.settings) : {};
    existingSettings.logoUrl = `/uploads/${fileName}`;
    await this.prisma.project.update({
      where: { id: projectId },
      data: { settings: JSON.stringify(existingSettings) },
    });

    return { logoUrl: `/uploads/${fileName}`, settings: existingSettings };
  }

  async deleteFile(fileId: string, userId: string) {
    const file = await this.prisma.projectFile.findFirst({
      where: { id: fileId, project: { userId } },
    });
    if (!file) throw new BadRequestException('الملف غير موجود');

    if (fs.existsSync(file.storagePath)) {
      fs.unlinkSync(file.storagePath);
    }

    await this.prisma.projectFile.delete({ where: { id: fileId } });
    return { message: 'تم حذف الملف' };
  }

  async getProjectFiles(projectId: string, userId: string) {
    return this.prisma.projectFile.findMany({
      where: { projectId, project: { userId } },
    });
  }
}
