import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string, status?: string, page = 1, limit = 20) {
    const where: any = { userId };
    if (status) where.status = status;

    const skip = (page - 1) * limit;
    const [projects, total] = await Promise.all([
      this.prisma.project.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
        include: { template: { select: { name: true, nameAr: true, thumbnailUrl: true } } },
      }),
      this.prisma.project.count({ where }),
    ]);

    return { data: projects, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findById(id: string, userId: string) {
    const project = await this.prisma.project.findFirst({
      where: { id, userId },
      include: {
        template: true,
        projectFiles: true,
      },
    });
    if (!project) throw new NotFoundException('المشروع غير موجود');
    return project;
  }

  async create(userId: string, data: any) {
    const project = await this.prisma.project.create({
      data: { userId, ...data },
    });
    return project;
  }

  async update(id: string, userId: string, data: any) {
    await this.findById(id, userId);
    return this.prisma.project.update({ where: { id }, data });
  }

  async remove(id: string, userId: string) {
    await this.findById(id, userId);
    await this.prisma.project.delete({ where: { id } });
    return { message: 'تم حذف المشروع' };
  }

  async toggleFavorite(id: string, userId: string) {
    const project = await this.findById(id, userId);
    return this.prisma.project.update({
      where: { id },
      data: { isFavorite: !project.isFavorite },
    });
  }

  async duplicate(id: string, userId: string) {
    const original = await this.findById(id, userId);
    const { id: _, userId: __, createdAt: ___, updatedAt: ____, sharedLink: _____, ...data } = original;
    return this.prisma.project.create({
      data: {
        ...data,
        title: `${data.title} (نسخة)`,
        userId,
        sharedLink: uuidv4(),
      },
    });
  }

  async getRecentProjects(userId: string, limit = 5) {
    return this.prisma.project.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      take: limit,
      include: { template: { select: { name: true, nameAr: true, thumbnailUrl: true } } },
    });
  }

  async getStats(userId: string) {
    const [total, byType, byStatus] = await Promise.all([
      this.prisma.project.count({ where: { userId } }),
      this.prisma.project.groupBy({
        by: ['projectType'],
        where: { userId },
        _count: true,
      }),
      this.prisma.project.groupBy({
        by: ['status'],
        where: { userId },
        _count: true,
      }),
    ]);
    return { total, byType, byStatus };
  }
}
