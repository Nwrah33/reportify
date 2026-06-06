import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class TemplatesService {
  constructor(private prisma: PrismaService) {}

  async findAll(category?: string, search?: string, page = 1, limit = 20) {
    const where: any = { isPublished: true };

    if (category) where.category = category;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const skip = (page - 1) * limit;
    const [templates, total] = await Promise.all([
      this.prisma.template.findMany({
        where,
        skip,
        take: limit,
        orderBy: { usageCount: 'desc' },
      }),
      this.prisma.template.count({ where }),
    ]);

    return { data: templates, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findById(id: string) {
    const template = await this.prisma.template.findUnique({ where: { id } });
    if (!template) throw new NotFoundException('القالب غير موجود');
    await this.prisma.template.update({ where: { id }, data: { usageCount: { increment: 1 } } });
    return template;
  }

  async getCategories() {
    const categories = await this.prisma.template.findMany({
      where: { isPublished: true },
      select: { category: true, subCategory: true },
      distinct: ['category'],
    });
    return categories.map(c => c.category);
  }

  async saveTemplate(userId: string, templateId: string) {
    return this.prisma.savedTemplate.upsert({
      where: { userId_templateId: { userId, templateId } },
      update: {},
      create: { userId, templateId },
    });
  }

  async unsaveTemplate(userId: string, templateId: string) {
    await this.prisma.savedTemplate.deleteMany({
      where: { userId, templateId },
    });
    return { message: 'تم إزالة القالب من المفضلة' };
  }

  async getSavedTemplates(userId: string) {
    return this.prisma.savedTemplate.findMany({
      where: { userId },
      include: { template: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Admin methods
  async create(data: any) {
    return this.prisma.template.create({ data });
  }

  async update(id: string, data: any) {
    return this.prisma.template.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.prisma.template.delete({ where: { id } });
    return { message: 'تم حذف القالب' };
  }
}
